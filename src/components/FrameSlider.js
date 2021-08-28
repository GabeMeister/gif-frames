import React from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';

import { getPercent } from './lib/math';

const StyledFrameSlider = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledFrameSliderContent = styled.div`
  box-sizing: border-box;
  padding: 10px;
  width: 80%;
  max-width: 1024px;
`;

export default function FrameSlider({ current, total, onFrameChange }) {
  return (
    <StyledFrameSlider className="__FrameSlider">
      <StyledFrameSliderContent>
        <h3>Progress: {getPercent(current, total - 1)}%</h3>
        <br />
        <Slider
          min={1}
          max={total - 1}
          step={1}
          value={current}
          onChange={onFrameChange}
          railStyle={{ 'backgroundColor': '#b8b8b8' }}
        />
      </StyledFrameSliderContent>
    </StyledFrameSlider>
  )
}