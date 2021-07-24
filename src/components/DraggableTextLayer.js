import React, { useRef, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import cloneDeep from "lodash.clonedeep";

import frameSizeState from "./state/atoms/frameSizeState";
import styled from "styled-components";
import PositionBuffer from "../data-models/PositionBuffer";
import { renderText } from "./lib/frames";
import framesState from "./state/atoms/framesState";
import fontSizeState from "./state/atoms/fontSizeState";
import frameIndexState from "./state/atoms/frameIndexState";
import selectedTextIdState from "./state/atoms/selectedTextIdState";
import { drawTextOnCanvas } from "./lib/fonts";

const StyledDraggableTextLayerWrapperDiv = styled.div`
  position: absolute;
  user-select: none;
`;

export default function DraggableTextLayer({ initialTextPlacement }) {
  const canvasRef = useRef();
  const frameSize = useRecoilValue(frameSizeState);
  const fontSize = useRecoilValue(fontSizeState);
  const frameIdx = useRecoilValue(frameIndexState);
  const selectedTextId = useRecoilValue(selectedTextIdState);
  const [mouseDown, setMouseDown] = useState(false);
  const [isTextClicked, setIsTextClicked] = useState(false);
  const [textPlacement, setTextPlacement] = useState(initialTextPlacement);
  const [frames, setFrames] = useRecoilState(framesState);
  const [cursorPos, setCursorPos] = useState({ x: -1, y: -1 });

  function isCursorPositionOverText(textPlacement, x, y) {
    const ctx = canvasRef.current.getContext('2d');
    
    return (
      x >= textPlacement.x
      && x <= (textPlacement.x + textPlacement.getWidth(ctx))
      && (y >= textPlacement.y - textPlacement.getHeight(ctx))
      && y <= textPlacement.y
    );
  }

  function onMouseDown(e) {
    setMouseDown(true);

    const pos = getMousePos(canvasRef.current, e);

    if (isCursorPositionOverText(textPlacement, pos.x, pos.y)) {
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
      let textPlacementCpy = cloneDeep(textPlacement);

      // Figure out the difference in how much the cursor has moved from last time
      const xChange = currentCursorPos.x - cursorPos.x;
      const yChange = currentCursorPos.y - cursorPos.y;

      textPlacementCpy.x += xChange;
      textPlacementCpy.y += yChange;

      setTextPlacement(textPlacementCpy);
      setCursorPos(currentCursorPos);

      // Also need to store the new x and y to the position buffer
      PositionBuffer.x = textPlacementCpy.x;
      PositionBuffer.y = textPlacementCpy.y;
    }

    handleCursorStyling(currentCursorPos);
  }

  function handleCursorStyling(pos) {
    if (isTextClicked || isCursorPositionOverText(textPlacement, pos.x, pos.y)) {
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
    const ctx = canvasRef.current.getContext('2d');

    // Clear all pre-existing text first
    ctx.clearRect(0, 0, frameSize.width, frameSize.height);

    drawTextOnCanvas(ctx, textPlacement, fontSize);

    // Put a nice little box as a visual indicator around the text you can
    // actually drag around
    ctx.beginPath();
    ctx.setLineDash([6]);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = '2';
    const padding = 10;
    ctx.rect(
      textPlacement.x - padding,
      textPlacement.y - textPlacement.getHeight(ctx) - padding,
      textPlacement.getWidth(ctx) + (padding*2),
      textPlacement.getHeight(ctx) + (padding*2)
    );
    ctx.stroke();
  }, [textPlacement, frameSize, fontSize]);
  
  return (
    <StyledDraggableTextLayerWrapperDiv>
      <canvas
        id={textPlacement.textId}
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
