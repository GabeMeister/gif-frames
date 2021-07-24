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
import isTextSelectedState from "./state/atoms/isTextSelectedState";
import { drawTextOnCanvas } from "./lib/fonts";
import { getMousePos, isCursorPositionOverText } from "./lib/mouseEvents";

const StyledDraggableTextLayerWrapperDiv = styled.div`
  position: absolute;
  user-select: none;
`;

export default function DraggableTextLayer({ initialTextPlacement }) {
  const canvasRef = useRef();
  const frameSize = useRecoilValue(frameSizeState);
  const fontSize = useRecoilValue(fontSizeState);
  const frameIdx = useRecoilValue(frameIndexState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  const [isTextSelected, setIsTextSelected] = useRecoilState(isTextSelectedState);
  const [textPlacement, setTextPlacement] = useState(initialTextPlacement);
  const [frames, setFrames] = useRecoilState(framesState);
  const [cursorPos, setCursorPos] = useState({ x: -1, y: -1 });

  function onMouseDown(e) {
    const pos = getMousePos(canvasRef.current, e);
    const ctx = canvasRef.current.getContext('2d');

    if (isCursorPositionOverText(ctx, textPlacement, pos.x, pos.y)) {
      setCursorPos(pos);
      setIsTextSelected(true);

      // Also need to store the new x and y to the position buffer
      PositionBuffer.x = textPlacement.x;
      PositionBuffer.y = textPlacement.y;
    }
  }

  function onMouseUp(e) {
    setIsTextSelected(false);
    console.log(PositionBuffer.x, PositionBuffer.y);
    let newFrames = renderText(frames, frameIdx, selectedTextId, PositionBuffer.x, PositionBuffer.y);
    setFrames(newFrames);
  }

  function onMouseMove(e) {
    const pos = getMousePos(canvasRef.current, e);
    const ctx = canvasRef.current.getContext('2d');

    if (isTextSelected) {
      let textPlacementCpy = cloneDeep(textPlacement);

      // Figure out the difference in how much the cursor has moved from last time
      const xChange = pos.x - cursorPos.x;
      const yChange = pos.y - cursorPos.y;

      textPlacementCpy.x += xChange;
      textPlacementCpy.y += yChange;

      setTextPlacement(textPlacementCpy);
      setCursorPos(pos);

      // Also need to store the new x and y to the position buffer
      PositionBuffer.x = textPlacementCpy.x;
      PositionBuffer.y = textPlacementCpy.y;
    }
    else if(!isCursorPositionOverText(ctx, textPlacement, pos.x, pos.y)) {
      // The user hovered away from the text
      setSelectedTextId(null);
    }
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

  useEffect(() => {
    if (isTextSelected) {
      canvasRef.current.style.cursor = 'grabbing';
    }
    else {
      canvasRef.current.style.cursor = 'grab';
    }
  }, [isTextSelected, canvasRef]);
  
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
