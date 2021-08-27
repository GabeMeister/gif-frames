import React from 'react';
import { Line } from 'rc-progress';
import styled from 'styled-components';

const StyledProgressBar = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledProgressBarWrapper = styled.div`
  box-sizing: border-box;
  padding: 10px;
  width: 80%;
  max-width: 1024px;
`;

export default function ProgressBar({ percent }) {
  return (
    <StyledProgressBar>
      <StyledProgressBarWrapper>
        <h3>Progress: {percent}%</h3>
        <br />
        <Line percent={percent} strokeWidth="1" strokeColor="#7FDBFF" />
      </StyledProgressBarWrapper>
    </StyledProgressBar>
  )
}