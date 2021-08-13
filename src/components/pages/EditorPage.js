import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import cloneDeep from "lodash.clonedeep";
import { useRecoilState, useSetRecoilState } from "recoil";
import gifFrames from "gif-frames";
import Hotkeys from "react-hot-keys";
import { Link } from 'react-router-dom';
import ReactTooltip from "react-tooltip";

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
import PositionBuffer from "../../data-models/PositionBuffer";
import { renderText } from "../lib/frames";
import useCountdownTimer from "../lib/useCountdownTimer";
import ProgressBar from "../ProgressBar";
import { getPercent } from "../lib/math";
import useQueryParam from "../lib/useQueryParam";
import LoadingAnimation from "../LoadingAnimation";

const StyledEditorPage = styled.div`
  width: 1024px;
  margin: auto;
  height: 100vh;
`;

const MainPanelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

const FrameWrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: 8px;
  margin-right: 8px;
`;

const NavButton = styled(Button)`
  margin-left: 3px;
  margin-right: 3px;
`;

const FinishLinkWrapper = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const ProgressTextWrapper = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const LoadingAnimationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function EditorPage() {
  
  /*
   * INITIALIZATION
   */

  const [frames, setFrames] = useRecoilState(framesState);
  const [frameIdx, setFrameIdx] = useRecoilState(frameIndexState);
  const setFrameSize = useSetRecoilState(frameSizeState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  const [isAutoplaying, setIsAutoplaying] = useState(false);

  const backgroundTextList = getBackgroundText();

  // Retrieve the gifUrl query param
  const gifUrl = useQueryParam('gifUrl');

  if(!gifUrl) {
    document.location.href = '/';
  }

  /*
   * HELPER FUNCTIONS
   */

  function onNextFrame() {
    if(frameIdx < frames.length - 1) {
      // Have to "render" the text onto the current frame
      let framesCpy = renderText(frames, frameIdx, selectedTextId, PositionBuffer.x, PositionBuffer.y);

      // Then copy that text onto the next frame
      framesCpy = copyFrameToNext(framesCpy);

      // Save the new frames data
      setFrames(framesCpy);

      // Then obviously move to the next frame
      setFrameIdx(frameIdx + 1);
    }
  }

  function onPreviousFrame() {
    if(frameIdx > 0) {
      // Have to "render" the text onto the current frame
      let framesCpy = renderText(frames, frameIdx, selectedTextId, PositionBuffer.x, PositionBuffer.y);

      // Then copy that text onto the previous frame
      framesCpy = copyFrameToPrevious(framesCpy);

      // Save the new frames data
      setFrames(framesCpy);

      // Then obviously move to the previous frame
      setFrameIdx(frameIdx - 1);
    }
  }

  function goToBeginning() {
    // Have to "render" the text onto the current frame
    let framesCpy = renderText(frames);

    // Save the new frames data
    setFrames(framesCpy);
    setFrameIdx(0);
    setSelectedTextId(null);
  }

  function goToEnd() {
    // Have to "render" the text onto the current frame
    let framesCpy = renderText(frames);

    // Save the new frames data
    setFrames(framesCpy);
    setFrameIdx(frames.length - 1);
    setSelectedTextId(null);
  }

  function copyFrameToNext(currentFrames) {
    return copyFrameToIndex(currentFrames, frameIdx + 1);
  }

  function copyFrameToPrevious(currentFrames) {
    return copyFrameToIndex(currentFrames, frameIdx - 1)
  }

  function copyFrameToIndex(currentFrames, destinationIndex) {
    if(!selectedTextId) {
      // Don't worry about doing anything if we don't have any text to work with
      return currentFrames;
    }

    let framesCpy = cloneDeep(currentFrames);
    let destinationFrame = framesCpy[destinationIndex];

    if(!destinationFrame.hasTextPlacement(selectedTextId)){
      // We have to create a new text object in the new frame because it doesn't exist yet
      destinationFrame.addTextPlacement(selectedTextId);
    }
    else {
      // Update the text position in the next frame
      destinationFrame.getTextPlacement(selectedTextId).x = PositionBuffer.x;
      destinationFrame.getTextPlacement(selectedTextId).y = PositionBuffer.y;
    }

    return framesCpy;
  }

  function getBackgroundText() {
    if(selectedTextId) {
      return frames[frameIdx]?.getVisibleTextListWithout([selectedTextId]);
    }
    else {
      return frames[frameIdx]?.getVisibleTextList();
    }
  }

  function handleKeydown(keyName, e, handle) {
    e.preventDefault();
    
    switch(keyName) {
      case 'enter':
      case 'right':
      case 's':
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
        onPreviousFrame();
        break;
      case 'shift+left':
        goToBeginning();
        break;
      case 'shift+right':
        goToEnd();
        break;
      default:
        // Do nothing
        break;
    }
  }

  /*
   * HOOKS
   */

  const initialize = useCallback(() => {
    // If we don't have a gif url don't do anything, we're about to redirect
    // back to the home page anyway
    if (!gifUrl) {
      return;
    }

    // If we're coming BACK to the editor page from another page, don't bother
    // re-initializing
    if(frames.length) {
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
  }, [gifUrl, setFrames, setFrameIdx, setFrameSize, frames.length]);

  useEffect(() => {
    initialize();
  }, [gifUrl, initialize]);

  const { 
    restart,
    stop,
    // TODO: Add back in the right way
    // number 
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
      keyName="enter,s,space,left,right,shift+left,shift+right"
      onKeyDown={handleKeydown}
    >
      <StyledEditorPage>
        {frames.length !== 0 ? (
          <>
            <EditorPageSidebar textLayerData={frames[frameIdx].textLayerData} />
            <MainPanelWrapper>
              <NavButton onClick={() => goToBeginning()}>{'<<'}</NavButton>
              <NavButton onClick={() => onPreviousFrame()}>{'<'}</NavButton>
              <div>
                <FrameWrapper
                  height={`${frames[frameIdx].textLayerData.height}px`}
                  width={`${frames[frameIdx].textLayerData.width}px`}
                >
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
                </FrameWrapper>
                <ProgressTextWrapper>{frameIdx + 1} / {frames.length}</ProgressTextWrapper>
              </div>
              <NavButton
                data-tip='Press "s" or "Enter" key to go to next frame'
                onClick={() => onNextFrame()}
              >{'>'}</NavButton>
              <ReactTooltip effect='solid' />
              <NavButton onClick={() => goToEnd()}>{'>>'}</NavButton>
            </MainPanelWrapper>
            <br />
            <ProgressBar percent={getPercent(frameIdx, frames.length - 1)} />
            <FinishLinkWrapper>
              <Link className="link-btn large" to={`/render?gifUrl=${gifUrl}`}>Preview & Finish</Link>
            </FinishLinkWrapper>
          </>
        ) : (
          <LoadingAnimationWrapper>
            <LoadingAnimation />
          </LoadingAnimationWrapper>
        )}
      </StyledEditorPage>
    </Hotkeys>
  );
}
