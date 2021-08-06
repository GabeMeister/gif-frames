import React from 'react';
import { Line } from 'rc-progress';
import styled from 'styled-components';

const StyledProgressBarWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px;
`;

export default function ProgressBar({ percent }) {
  return (
    <StyledProgressBarWrapper>
      <h3>Progress: {percent}%</h3>
      <br />
      <Line percent={percent} strokeWidth="1" strokeColor="#7FDBFF" />
    </StyledProgressBarWrapper>
  )
}