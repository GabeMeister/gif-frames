import React from 'react';
import styled from 'styled-components';

const StyledLoadingGif = styled.img`
  width: 200px;
`;

export default function LoadingAnimation() {
  return (
    <StyledLoadingGif src="loading-blocks.gif" />
  );
}