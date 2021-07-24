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
import ConfirmLink from './ConfirmLink';
import TextManager from '../data-models/TextManager';

const AddTextBtn = styled(Button)`
  margin-left: 5px;
`;

const TextOptions = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxAndLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TextLabel = styled.label`
  font-size: 24px;
  margin-left: 4px;
`;

const DeleteBtn = styled.button`
  cursor: pointer;
  font-size: 24px;
  color: #FF4136;
`;

// A sidebar that holds all the different texts of the current frame
export default function EditorPageSidebar() {
  const textRef = useRef();
  const [frames, setFrames] = useRecoilState(framesState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  const setFontSize = useSetRecoilState(fontSizeState);
  const frameIdx = useRecoilValue(frameIndexState);

  function addTextToFrame(text) {
    if(text === '') {
      return;
    }
    
    let framesCpy = cloneDeep(frames);

    // Create the new "global" text (that all frames will know about)
    const newText = TextManager.createText(text);
    textRef.current.value = '';

    // Create the new text "placement" for this frame in particular (the thing
    // that keeps track of where a particular piece of text is in the frame)
    framesCpy[frameIdx].addTextPlacement(newText.id);
    
    setFrames(framesCpy);
    setSelectedTextId(newText.id);
  }

  function onFontSizeChange(fontSize) {
    setFontSize(fontSize);
  }

  function deleteText(textIdToDelete) {
    // Delete the text itself
    TextManager.deleteTextById(textIdToDelete);
    
    // Delete the associated text placements from all the frames
    let framesCpy = cloneDeep(frames);

    framesCpy.forEach(frame => {
      frame.deleteTextPlacement(textIdToDelete);
    });
    console.log('***** framesCpy *****', framesCpy);

    setFrames(framesCpy);

    // The current selected text might be the one that we just deleted, so clear that out as well
    if(selectedTextId === textIdToDelete) {
      setSelectedTextId(null);
    }
  }
  
  return (
    <StyledSidebarDiv>
      <ConfirmLink to="/" />
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
      <AddTextBtn onClick={() => addTextToFrame(textRef.current.value)}>Add</AddTextBtn>
      <br />
      <br />
      <ul>
        {!TextManager.empty() && TextManager.getAll().map(text => (
          <TextOptions key={text.id}>
            <CheckboxAndLabelWrapper>
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
              <TextLabel htmlFor={text.id}>{text.text}</TextLabel><br />
            </CheckboxAndLabelWrapper>
            <DeleteBtn>
              <span onClick={() => deleteText(text.id)}>X</span>
            </DeleteBtn>
          </TextOptions>
        ))}
      </ul>
    </StyledSidebarDiv>
  );
}