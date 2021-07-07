import React, { useRef } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import cloneDeep from "lodash.clonedeep";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import selectedTextIdState from './state/atoms/selectedTextIdState';
import framesState from "./state/atoms/framesState";
import frameIndexState from "./state/atoms/frameIndexState";
import fontSizeState from "./state/atoms/fontSizeState";
import Button from "./Button";
import StyledSidebarDiv from './styled-components/StyledSidebarDiv';
import HomeButton from './HomeButton';

const AddTextBtn = styled(Button)`
  margin-left: 5px;
`;

// A sidebar that holds all the different texts of the current frame
export default function EditorPageSidebar({ textLayerData }) {
  const textRef = useRef();
  const [frames, setFrames] = useRecoilState(framesState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  const setFontSize = useSetRecoilState(fontSizeState);
  const frameIdx = useRecoilValue(frameIndexState);

  function addText(text) {
    let framesCpy = cloneDeep(frames);
    const newTextId = framesCpy[frameIdx].textLayerData.addText(text);
    textRef.current.value = '';
    
    setFrames(framesCpy);
    setSelectedTextId(newTextId);
  }

  function onFontSizeChange(fontSize) {
    setFontSize(fontSize);
  }
  
  return (
    <StyledSidebarDiv>
      <HomeButton />
      <br />
      <br />
      <br />
      <h3>Font Size:</h3>
      <br />
      <Slider
        min={1}
        max={64}
        step={1}
        defaultValue={32}
        onChange={onFontSizeChange}
      />
      <br />
      <input type="text" ref={textRef} />
      <AddTextBtn onClick={() => addText(textRef.current.value)}>Add</AddTextBtn>
      <br />
      <br />
      <ul>
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
      </ul>
    </StyledSidebarDiv>
  );
}