import React, { useRef, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import cloneDeep from "lodash.clonedeep";

import frameSizeState from "./state/atoms/frameSizeState";
import styled from "styled-components";
import PositionBuffer from "../data-models/PositionBuffer";
import { renderText } from "./lib/frames";
import framesState from "./state/atoms/framesState";
import frameIndexState from "./state/atoms/frameIndexState";
import selectedTextIdState from "./state/atoms/selectedTextIdState";

const StyledDraggableTextLayerWrapperDiv = styled.div`
  position: absolute;
  user-select: none;
`;

export default function DraggableTextLayer({ initialTextData }) {
  // console.log('***** DraggableTextLayer *****');
  const canvasRef = useRef();
  const frameSize = useRecoilValue(frameSizeState);
  const frameIdx = useRecoilValue(frameIndexState);
  const selectedTextId = useRecoilValue(selectedTextIdState);
  const [mouseDown, setMouseDown] = useState(false);
  const [textData, setTextData] = useState(initialTextData);
  const [frames, setFrames] = useRecoilState(framesState);

  function isTextClicked(text, x, y) {
    return (
      x >= text.x
      && x <= (text.x + text.width)
      && (y >= text.y - text.height)
      && y <= text.y
    );
  }

  function onMouseDown(e) {
    setMouseDown(true);

    const pos = getMousePos(canvasRef.current, e);
    const isClicked = isTextClicked(textData, pos.x, pos.y);

    if (isClicked) {

    }
  }

  function onMouseUp(e) {
    setMouseDown(false);

    let newFrames = renderText(frames, frameIdx, selectedTextId, PositionBuffer.x, PositionBuffer.y);
    setFrames(newFrames);
  }

  function onMouseMove(e) {
    const pos = getMousePos(canvasRef.current, e);

    if (mouseDown) {
      let textDataCpy = cloneDeep(textData);

      const xChange = pos.x - textData.x;
      const yChange = pos.y - textData.y;

      textDataCpy.x += xChange;
      textDataCpy.y += yChange;

      setTextData(textDataCpy);

      // Also need to store the new x and y to the position buffer
      PositionBuffer.x = textDataCpy.x;
      PositionBuffer.y = textDataCpy.y;
    }

    // const index = canvasTextList.findIndex(text => isTextClicked(text, pos.x, pos.y));
    // if (index >= 0) {
    //   if (mouseDown) {
    //     canvasRef.current.style.cursor = 'grabbing';
    //   }
    //   else {
    //     canvasRef.current.style.cursor = 'grab';
    //   }
    // }
    // else {
    //   canvasRef.current.style.cursor = 'default';
    // }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    // Clear all pre-existing text first
    ctx.clearRect(0, 0, frameSize.width, frameSize.height);

    ctx.font = `32px Impact, Charcoal, sans-serif`;
    ctx.fillStyle = "red";
    ctx.fillText(textData.text, textData.x, textData.y);
  }, [textData, frameSize]);

  return (
    <StyledDraggableTextLayerWrapperDiv>
      <canvas
        id={textData.id}
        ref={canvasRef}
        height={frameSize.height}
        width={frameSize.width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </StyledDraggableTextLayerWrapperDiv>
  );
}
