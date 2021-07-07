import React from 'react';
import { useSetRecoilState } from 'recoil';
import Slider from 'rc-slider';
import { Link } from 'react-router-dom';
import 'rc-slider/assets/index.css';

import StyledSidebarDiv from './styled-components/StyledSidebarDiv';
import delayState from './state/atoms/delayState';

const MAX_DELAY = 200;

// A sidebar that holds all the different texts of the current frame
export default function RenderPageSidebar({ textLayerData }) {
  const setDelay = useSetRecoilState(delayState);

  function onGifSpeedChange(delay) {
    // Because a larger delay means the gif will be slower, we have to reverse
    // the amount the user chose to make it seem like a bigger value in the
    // slide will seem like a "faster" play speed.
    setDelay(MAX_DELAY - delay);
  }
  
  return (
    <StyledSidebarDiv>
      <Link to="/">← Back to Home</Link>
      <br />
      <br />
      <br />
      Gif Playback Speed:
      <Slider
        min={1}
        max={MAX_DELAY}
        step={1}
        defaultValue={MAX_DELAY / 2}
        onAfterChange={onGifSpeedChange}
      />
    </StyledSidebarDiv>
  );
}