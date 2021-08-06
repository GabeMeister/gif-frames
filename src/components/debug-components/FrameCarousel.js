import React, { useState } from "react";
import styled from "styled-components";

const StyledNavButton = styled.button`
  padding: 10px;
  border-radius: 3px;
  background-color: #70cf65;
`;

export default function FrameCarousel({ canvasList }) {
  const [index, setIndex] = useState(0);

  function move(newIndex) {
    if(newIndex < canvasList.length && newIndex >= 0) {
      setIndex(newIndex);
    }
  }
  
  return (
    <>
      Index: {index} / {canvasList.length - 1}
      <br />
      <StyledNavButton onClick={() => move(0)}>Beginning</StyledNavButton>
      <br />
      <StyledNavButton onClick={() => move(index - 1)}>Back</StyledNavButton>{' '}
      <StyledNavButton onClick={() => move(index + 1)}>Forward</StyledNavButton>
      <img
        src={canvasList[index].toDataURL()}
        alt="debug-img"
      />
    </>
  );
}