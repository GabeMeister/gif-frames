import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import selectedTextIdState from './state/atoms/selectedTextIdState';

const StyledSidebarDiv = styled.ul`
  position: absolute;
  top: 100px;
  left: 0;
  width: 180px;
  height: 700px;
  background-color: lightsteelblue;
`;

// A sidebar that holds all the different texts of the current frame
export default function Sidebar({ textLayerData }) {
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  
  return (
    <StyledSidebarDiv>
      {textLayerData && textLayerData.textList.map(text => (
        <li key={text.id}>
          <input
            type="checkbox"
            id={text.id}
            name="text_list"
            value={text.id}
            checked={text.id === selectedTextId}
            onChange={evt => {
              // Sometimes the user doesn't want any text selected, so allow for
              // unchecking
              if(selectedTextId === evt.target.value) {
                setSelectedTextId(null);
              }
              else {
                setSelectedTextId(evt.target.value);
              }
            }}
          />
          <label htmlFor={text.id}>{text.text}</label><br />
        </li>
      ))}
    </StyledSidebarDiv>
  );
}