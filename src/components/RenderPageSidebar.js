import React from 'react';
import { useSetRecoilState } from 'recoil';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import StyledSidebarDiv from './styled-components/StyledSidebarDiv';
import delayState from './state/atoms/delayState';
import ConfirmLink from './ConfirmLink';
import Link from './Link';
import useQueryParam from './lib/useQueryParam';

const MAX_DELAY = 200;

// A sidebar that holds all the different texts of the current frame
export default function RenderPageSidebar() {
  const setDelay = useSetRecoilState(delayState);

  // Retrieve the gifUrl query param
  const gifUrl = useQueryParam('gifUrl');

  function onGifSpeedChange(delay) {
    // Because a larger delay means the gif will be slower, we have to reverse
    // the amount the user chose to make it seem like a bigger value in the
    // slide will seem like a "faster" play speed. At LEAST make it 20 tho
    setDelay(Math.max(MAX_DELAY - delay, 20));
  }
  
  return (
    <StyledSidebarDiv>
      <ConfirmLink to='/' text={'← Create new gif'} />
      <br />
      <br />
      <Link to={`/editor?gifUrl=${gifUrl}`} text={'← Back to Editing'} />
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