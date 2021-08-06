import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import framesState from '../state/atoms/framesState';

const StyledFrameDump = styled.div`
  width: 600px;
  margin: auto;
`;

export default function FrameDump() {
  const frames = useRecoilValue(framesState);

  return (
    <StyledFrameDump>
      {frames.map(f => <img alt={f.getHash()} src={f.imageLayerData.dataUrl} />)}
    </StyledFrameDump>
  );
}