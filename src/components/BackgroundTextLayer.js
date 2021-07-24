import React, { useEffect, useRef } from 'react';
import {
  useRecoilValue,
  useSetRecoilState
} from 'recoil';
import frameSizeState from './state/atoms/frameSizeState';
import fontSizeState from "./state/atoms/fontSizeState";
import isTextSelectedState from './state/atoms/isTextSelectedState';
import selectedTextIdState from './state/atoms/selectedTextIdState';
import md5 from 'md5';
import styled from 'styled-components';
import { drawTextOnCanvas } from "./lib/fonts";
import { getMousePos, isCursorPositionOverText } from './lib/mouseEvents';

const StyledBackgroundTextLayerWrapperDiv = styled.div`
  position: absolute;
  user-select: none;
`;

export default function BackgroundTextLayer({ textPlacements = [] }) {
  const canvasRef = useRef(null);
  const frameSize = useRecoilValue(frameSizeState);
  const fontSize = useRecoilValue(fontSizeState);
  const isTextSelected = useRecoilValue(isTextSelectedState);
  const setSelectedTextId = useSetRecoilState(selectedTextIdState);

  function onMouseMove(e) {
    const pos = getMousePos(canvasRef.current, e);
    const ctx = canvasRef.current.getContext('2d');

    // We only care if the user isn't already currently dragging around text
    if (!isTextSelected) {
      // Loop through all the text placements and check if any of them were hovered over
      let hoveredOverText = false;
      textPlacements.forEach(textPlacement => {
        if(isCursorPositionOverText(ctx, textPlacement, pos.x, pos.y)) {
          setSelectedTextId(textPlacement.textId);
          hoveredOverText = true;
          return false;
        }
      });

      if(!hoveredOverText) {
        setSelectedTextId(null);
      }
    }
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, frameSize.width, frameSize.height);

    // Iterate through the texts and paint them on
    textPlacements.forEach(textPlacement => {
      drawTextOnCanvas(ctx, textPlacement, fontSize);
    });

    canvasRef.current.style.cursor = 'default';
  }, [textPlacements, frameSize, fontSize]);

  return (
    <StyledBackgroundTextLayerWrapperDiv>
      <canvas
        id={md5(JSON.stringify(textPlacements.map(textPlacement => textPlacement.getLinkedTextId())))}
        ref={canvasRef}
        height={frameSize.height}
        width={frameSize.width}
        className="js-frame-canvas"
        onMouseMove={onMouseMove}
      />
    </StyledBackgroundTextLayerWrapperDiv>
  );
};
