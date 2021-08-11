import React from 'react';
import styled from 'styled-components';

const StyledSpacer = styled.div`
  height: ${props => props.height}
`;

export default function Spacer({ height }) {
  return (
    <StyledSpacer height={height} className="__Spacer"></StyledSpacer>
  );
}