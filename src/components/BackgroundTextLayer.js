import React, { useEffect, useRef } from 'react';
import {
  useRecoilValue
} from 'recoil';
import frameSizeState from './state/atoms/frameSizeState';
import fontSizeState from "./state/atoms/fontSizeState";
import md5 from 'md5';
import styled from 'styled-components';

const StyledBackgroundTextLayerWrapperDiv = styled.div`
  position: absolute;
  user-select: none;
`;

export default function BackgroundTextLayer({ textList = [] }) {
  const canvasRef = useRef(null);
  const frameSize = useRecoilValue(frameSizeState);
  const fontSize = useRecoilValue(fontSizeState);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Setup the font style
    ctx.font = `${fontSize}px Impact, Charcoal, sans-serif`;

    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, frameSize.width, frameSize.height);

    // Iterate through the texts and paint them on
    textList.forEach(textData => {
      ctx.fillStyle = textData.color;
      ctx.fillText(textData.text, textData.x, textData.y);
    });
  }, [textList, frameSize, fontSize]);

  return (
    <StyledBackgroundTextLayerWrapperDiv>
      <canvas
        id={md5(JSON.stringify(textList.map(textData => textData.text)))}
        ref={canvasRef}
        height={frameSize.height}
        width={frameSize.width}
        className="js-frame-canvas"
      />
    </StyledBackgroundTextLayerWrapperDiv>
  );
};
