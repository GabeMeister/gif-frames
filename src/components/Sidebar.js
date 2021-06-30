import React from 'react';
import styled from 'styled-components';

const StyledSidebarUL = styled.div`
  position: absolute;
  top: 100px;
  left: 0;
  width: 200px;
  height: 700px;
  background-color: lightsteelblue;
`;

// A sidebar that holds all the different texts of the current frame
export default function Sidebar({onTextSelect}) {
  return (
    <StyledSidebarUL>
      <input type="radio" id="dog" name="text_list" value="dog" />
      <label htmlFor="dog">Dog</label><br />
      <input type="radio" id="cat" name="text_list" value="cat" />
      <label htmlFor="cat">Cat</label><br />
      <input type="radio" id="zebra" name="text_list" value="zebra" />
      <label htmlFor="zebra">Zebra</label><br />
    </StyledSidebarUL>
  );
}