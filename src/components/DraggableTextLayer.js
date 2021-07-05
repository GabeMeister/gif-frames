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
  const canvasRef = useRef();
  const frameSize = useRecoilValue(frameSizeState);
  const frameIdx = useRecoilValue(frameIndexState);
  const selectedTextId = useRecoilValue(selectedTextIdState);
  const [mouseDown, setMouseDown] = useState(false);
  const [isTextClicked, setIsTextClicked] = useState(false);
  const [textData, setTextData] = useState(initialTextData);
  const [canvasTextData, setCanvasTextData] = useState({});
  const [frames, setFrames] = useRecoilState(framesState);
  const [cursorPos, setCursorPos] = useState({ x: -1, y: -1 });

  function isCursorPositionOverText(text, x, y) {
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

    if (isCursorPositionOverText(canvasTextData, pos.x, pos.y)) {
      setCursorPos(pos);
      setIsTextClicked(true);
    }
  }

  function onMouseUp(e) {
    setMouseDown(false);
    setIsTextClicked(false);

    let newFrames = renderText(frames, frameIdx, selectedTextId, PositionBuffer.x, PositionBuffer.y);
    setFrames(newFrames);
  }

  function onMouseMove(e) {
    const currentCursorPos = getMousePos(canvasRef.current, e);

    if (mouseDown) {
      let textDataCpy = cloneDeep(textData);

      // Figure out the difference in how much the cursor has moved from last time
      const xChange = currentCursorPos.x - cursorPos.x;
      const yChange = currentCursorPos.y - cursorPos.y;

      textDataCpy.x += xChange;
      textDataCpy.y += yChange;

      setTextData(textDataCpy);
      setCursorPos(currentCursorPos);

      // Also need to store the new x and y to the position buffer
      PositionBuffer.x = textDataCpy.x;
      PositionBuffer.y = textDataCpy.y;
    }

    handleCursorStyling(currentCursorPos);
  }

  function handleCursorStyling(pos) {
    if (isTextClicked || isCursorPositionOverText(canvasTextData, pos.x, pos.y)) {
      if (mouseDown) {
        canvasRef.current.style.cursor = 'grabbing';
      }
      else {
        canvasRef.current.style.cursor = 'grab';
      }
    }
    else {
      canvasRef.current.style.cursor = 'default';
    }
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

    // Need to calculate the text width based off of the canvas context
    const canvasText = cloneDeep(textData);
    canvasText.width = ctx.measureText(textData.text).width;
    canvasText.height = 25;
    setCanvasTextData(canvasText);
    
    // Put a nice little box as a visual indicator around the text you can
    // actually drag around
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = "2";
    const padding = 10;
    ctx.rect(canvasText.x - padding, canvasText.y - canvasText.height - padding, canvasText.width + (padding*2), canvasText.height + (padding*2));
    ctx.stroke();
  }, [textData, frameSize, setCanvasTextData]);

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
