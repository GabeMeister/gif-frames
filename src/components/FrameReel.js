import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 50%;
  height: 500px;
  position: absolute;
  top: 0;
  right: 0;
`;

export default function FrameReel({ children }) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
};
