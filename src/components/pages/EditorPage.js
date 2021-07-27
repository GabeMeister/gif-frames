import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import cloneDeep from "lodash.clonedeep";
import { useRecoilState, useSetRecoilState } from "recoil";
import gifFrames from "gif-frames";
import Hotkeys from "react-hot-keys";
import { Link } from 'react-router-dom';

import EditorPageSidebar from "../EditorPageSidebar";
import Button from "../Button";
import FrameData from "../../data-models/FrameData";
import framesState from "../state/atoms/framesState";
import frameIndexState from "../state/atoms/frameIndexState";
import frameSizeState from "../state/atoms/frameSizeState";
import selectedTextIdState from "../state/atoms/selectedTextIdState";
import ImageLayer from "../ImageLayer";
import DraggableTextLayer from "../DraggableTextLayer";
import BackgroundTextLayer from "../BackgroundTextLayer";
import Controls from "../Controls";
import PositionBuffer from "../../data-models/PositionBuffer";
import { renderText } from "../lib/frames";
// import useInterval from "../lib/useInterval";
import useCountdownTimer from "../lib/useCountdownTimer";

const StyledEditorPageDiv = styled.div`
  width: 1024px;
  background-color: lightgray;
  margin: auto;
  height: 100vh;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EditorPage() {
  const [frames, setFrames] = useRecoilState(framesState);
  const [frameIdx, setFrameIdx] = useRecoilState(frameIndexState);
  const setFrameSize = useSetRecoilState(frameSizeState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  const [isAutoplaying, setIsAutoplaying] = useState(false);

  const backgroundTextList = getBackgroundText();

  // Retrieve the gifUrl query param
  let query = useQuery();
  const gifUrl = query.get('gifUrl');

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

  function goToBeginning() {
    // Have to "render" the text onto the current frame
    let newFrames = renderText(frames);

    // Save the new frames data
    setFrames(newFrames);
    setFrameIdx(0);
    setSelectedTextId(null);
  }

  function copyFrameToNext(currentFrames) {
    if(!selectedTextId) {
      // Don't worry about doing anything if we don't have any text to work with
      return currentFrames;
    }

    let framesCpy = cloneDeep(currentFrames);
    let nextFrame = framesCpy[frameIdx + 1];

    if(!nextFrame.hasTextPlacement(selectedTextId)){
      // We have to create a new text object in the new frame because it doesn't exist yet
      nextFrame.addTextPlacement(selectedTextId);
    }
    else {
      // Update the text position in the next frame
      nextFrame.getTextPlacement(selectedTextId).x = PositionBuffer.x;
      nextFrame.getTextPlacement(selectedTextId).y = PositionBuffer.y;
    }

    return framesCpy;
  }

  function getBackgroundText() {
    if(selectedTextId) {
      return frames[frameIdx]?.getTextListWithout([selectedTextId]);
    }
    else {
      return frames[frameIdx]?.getTextList();
    }
  }

  function handleKeydown(keyName, e, handle) {
    e.preventDefault();
    
    switch(keyName) {
      case 'enter':
        onNextFrame();
        break;
      case 'space':
        if(isAutoplaying) {
          stop();
          setIsAutoplaying(false);
        }
        else {
          restart();
          setIsAutoplaying(true);
        }
        break;
      case 'left':
        goToBeginning();
        break;
      default:
        // Do nothing
        break;
    }
  }

  const initialize = useCallback(() => {
    // If we don't have a gif url don't do anything, we're about to redirect
    // back to the home page anyway
    if (!gifUrl) {
      return;
    }

    gifFrames({
      url: gifUrl,
      frames: 'all',
      outputType: 'canvas',
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

  useEffect(() => {
    initialize();
  }, [gifUrl, setFrames, setFrameIdx, setFrameSize, initialize]);

  const { 
    restart,
    stop,
    number
  } = useCountdownTimer({
    millisecondsPerStep: 200,
    startingNumber: 3,
    onFinish: () => {
      onNextFrame();
      
      if(frameIdx === frames.length - 1) {
        stop();
        setIsAutoplaying(false);
      }
      else {
        restart();
      }
    }
  });
  
  return (
    <Hotkeys
      keyName="enter,space,left"
      onKeyDown={handleKeydown}
    >
      <StyledEditorPageDiv>
        {frames.length !== 0 ? (
          <>
            <EditorPageSidebar textLayerData={frames[frameIdx].textLayerData} />
            <div>
              <ImageLayer
                imageLayerData={frames[frameIdx].imageLayerData}
              />
              {backgroundTextList.length !== 0 && (
                <BackgroundTextLayer
                  textPlacements={backgroundTextList}
                />
              )}
              {selectedTextId && (
                <DraggableTextLayer
                  key={selectedTextId}
                  initialTextPlacement={frames[frameIdx].getTextPlacement(selectedTextId)}
                />
              )}
            </div>
            <Controls>
              <div>
                <h1>{frameIdx + 1} / {frames.length}</h1>
              </div>
              <br />
              <Button color="orange" onClick={onNextFrame}>Next Frame</Button>
              <br />
              <br />
              <Button color="BurlyWood" onClick={goToBeginning}>Go to First Frame</Button>
              <br />
              <br />
              <Button color="lightgreen"><Link to="/render">Finish</Link></Button>
              <br />
              <br />
              {isAutoplaying && (
                <h1>Autoplay Timer: {number}</h1>
              )}
            </Controls>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </StyledEditorPageDiv>
    </Hotkeys>
  );
}
