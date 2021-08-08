import React from 'react';
import styled from 'styled-components';

const StyledRightClickMenu = styled.div`
  position: fixed;
  min-width: 100px;
  box-shadow: 3px 4px 11px 6px rgba(0,0,0,0.32);
  border-radius: 5px;
`;

export default function RightClickMenu({ show, coord, content }) {
  return (
    <>
      {show && (
        <StyledRightClickMenu style={{ top: coord.y, left: coord.x }}>
          {content}
        </StyledRightClickMenu>
      )}
    </>
  );
}