import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import cloneDeep from "lodash.clonedeep";
import { useRecoilState, useSetRecoilState } from "recoil";
import gifFrames from "gif-frames";
import Hotkeys from "react-hot-keys";

import Sidebar from "../Sidebar";
import Button from "../Button";
import FrameData from "../../data-models/FrameData";
import framesState from "../../components/state/atoms/framesState";
import frameIndexState from "../../components/state/atoms/frameIndexState";
import frameSizeState from "../../components/state/atoms/frameSizeState";
import selectedTextIdState from "../../components/state/atoms/selectedTextIdState";
import ImageLayer from "../ImageLayer";
import DraggableTextLayer from "../DraggableTextLayer";
import BackgroundTextLayer from "../BackgroundTextLayer";
import Controls from "../Controls";
import PositionBuffer from "../../data-models/PositionBuffer";
import { renderText } from "../lib/frames";

const StyledEditorPageDiv = styled.div`
  width: 1024px;
  background-color: lightgray;
  margin: auto;
  height: 100vh;
`;

const AddTextBtn = styled(Button)`
  margin-left: 5px;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EditorPage2() {
  const textRef = useRef();
  const [frames, setFrames] = useRecoilState(framesState);
  const [frameIdx, setFrameIdx] = useRecoilState(frameIndexState);
  const setFrameSize = useSetRecoilState(frameSizeState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  
  const textListWithoutSelectedText = frames[frameIdx]?.textLayerData?.textList?.filter(textData => textData.id !== selectedTextId);

  // Retrieve the gifUrl query param
  let query = useQuery();
  const gifUrl = query.get("gifUrl");

  function addText(text) {
    let framesCpy = cloneDeep(frames);
    const newTextId = framesCpy[frameIdx].textLayerData.addText(text);
    setFrames(framesCpy);
    setSelectedTextId(newTextId);
  }

  function onNextFrame() {
    if(frameIdx < frames.length - 1) {
      // Have to "render" the text onto the current frame
      let newFrames = renderText(frames, frameIdx, selectedTextId, PositionBuffer.x, PositionBuffer.y);

      // Then copy that text onto the next frame
      newFrames = copyFrameToNext(newFrames);

      // Save the new frames data
      setFrames(newFrames);

      // Then obviously move to the next frame
      setFrameIdx(frameIdx + 1);
    }
  }

  function onKeyDown(keyName, e, handle) {
    onNextFrame();
  }

  function goToBeginning() {
    // Have to "render" the text onto the current frame
    let newFrames = renderText(frames);

    // Save the new frames data
    setFrames(newFrames);

    setFrameIdx(0);
  }

  function copyFrameToNext(currentFrames) {
    if(!selectedTextId) {
      // Don't worry about doing anything if we don't have any text to work with
      return currentFrames;
    }

    let framesCpy = cloneDeep(currentFrames);
    let currentSelectedText = framesCpy[frameIdx]
      .textLayerData
      .textList
      .find(textData => textData.id === selectedTextId);
    let nextFrameTextLayerData = framesCpy[frameIdx + 1].textLayerData;
    let nextFrameTextList = nextFrameTextLayerData.textList;
    const nextSelectedText = nextFrameTextList.find(textData => textData.id === selectedTextId);

    if(!nextFrameTextList.find(textData => textData.id === selectedTextId)){
      // We have to create a new text object in the new frame because it doesn't exist yet
      nextFrameTextLayerData.addText(currentSelectedText.text, PositionBuffer.x, PositionBuffer.y);
    }
    // Stomp the text in the next frame
    else {
      nextSelectedText.x = PositionBuffer.x;
      nextSelectedText.y = PositionBuffer.y;
    }

    return framesCpy;
  }

  useEffect(() => {
    // If we don't have a gif url don't do anything, we're about to redirect
    // back to the home page anyway
    if (!gifUrl) {
      return;
    }

    gifFrames({
      url: gifUrl,
      frames: "all",
      outputType: "canvas",
      cumulative: true,
    }).then((frames) => {
      const extractedFrames = frames.map((frame) => {
        const canvas = frame.getImage();
        return new FrameData(canvas);
      });

      setFrames(extractedFrames);
      setFrameIdx(0);
      setFrameSize({
        height: extractedFrames[0].imageLayerData.height,
        width: extractedFrames[0].imageLayerData.width
      });
    });
  }, [gifUrl, setFrames, setFrameIdx, setFrameSize]);

  return (
    <Hotkeys
      keyName="enter"
      onKeyDown={onKeyDown}
    >
      <StyledEditorPageDiv className="yoo">
        {frames.length !== 0 && (
          <>
            <Sidebar textLayerData={frames[frameIdx].textLayerData} />
            <div>
              <ImageLayer
                imageLayerData={frames[frameIdx].imageLayerData}
              />
              {textListWithoutSelectedText.length !== 0 && (
                <BackgroundTextLayer
                  textList={textListWithoutSelectedText}
                />
              )}
              {selectedTextId && (
                <DraggableTextLayer
                  key={selectedTextId}
                  initialTextData={frames[frameIdx].textLayerData.textList.find(textData => textData.id === selectedTextId)}
                />
              )}
            </div>
            <Controls>
              <input type="text" ref={textRef} />
              <AddTextBtn onClick={() => addText(textRef.current.value)}>Add</AddTextBtn>
              <br />
              <br />
              <Button color="orange" onClick={onNextFrame}>Next Frame</Button>
              <br />
              <br />
              <Button color="purple" onClick={goToBeginning}>Go to First Frame</Button>
            </Controls>
          </>
        )}
      </StyledEditorPageDiv>
    </Hotkeys>
  );
}
