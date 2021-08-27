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
import useAutoPositionedTextIndices from './lib/useAutoPositionedTextIndices';
import StyledTextInput from './styled-components/StyledTextInput';

const StyledAddTextBtn = styled(Button)`
  margin-left: 5px;
`;

const StyledTextOptions = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTextLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTextLabel = styled.span`
  margin-left: 4px;
  font: bold 28px sans-serif;
  color: ${props => props.color};
  text-shadow: 1px 1px 7px black;
`;

const DeleteBtn = styled.img`
  cursor: pointer;
  width: 40px;
`;

const TextInputForm = styled.form`
  display: flex;
`;

// A sidebar that holds all the different texts of the current frame
export default function EditorPageSidebar() {
  const textRef = useRef();
  const [frames, setFrames] = useRecoilState(framesState);
  const [selectedTextId, setSelectedTextId] = useRecoilState(selectedTextIdState);
  const setFontSize = useSetRecoilState(fontSizeState);
  const frameIdx = useRecoilValue(frameIndexState);
  const { initAutoPosition, deleteAutoPosition } = useAutoPositionedTextIndices();

  function addTextToFrames(text) {
    if(text === '') {
      return;
    }
    
    // Create the new "global" text (that all frames will know about)
    const newText = TextManager.createText(text);

    // Reset the text input back to nothing
    textRef.current.value = '';

    let framesCpy = cloneDeep(frames);
    
    // Create the new text "placement" for all frames, but initially create them
    // hidden
    framesCpy.forEach(frame => {
      frame.addTextPlacement(newText.id);
    });

    // Make it visible from current frame onwards
    for(let i = frameIdx; i < framesCpy.length; i++) {
      framesCpy[i].setTextPlacementVisibility(newText.id, true);
    }
    
    initAutoPosition(newText.id, frameIdx + 1);
    
    setFrames(framesCpy);
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
      frame.deleteText(textIdToDelete);
    });

    setFrames(framesCpy);

    // The current selected text might be the one that we just deleted, so clear that out as well
    if(selectedTextId === textIdToDelete) {
      setSelectedTextId(null);
    }

    deleteAutoPosition(textIdToDelete);
  }
  
  return (
    <StyledSidebarDiv className="__EditorPageSidebar">
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
        railStyle={{ 'backgroundColor': '#b8b8b8' }}
      />
      <br />
      <ul>
        {!TextManager.empty() && TextManager.getAll().map(text => (
          <StyledTextOptions key={text.id}>
            <StyledTextLabelWrapper>
              <StyledTextLabel color={text.color}>{text.text}</StyledTextLabel><br />
            </StyledTextLabelWrapper>
            <DeleteBtn
              onClick={() => {
                if(window.confirm('Are you sure you want to delete this text?')){
                  deleteText(text.id);
                }
              }}
              src="trash.png"
            />
          </StyledTextOptions>
        ))}
      </ul>
      <br />
      <TextInputForm onSubmit={evt => {
        evt.preventDefault();
        addTextToFrames(textRef.current.value);
      }}>
        <StyledTextInput type="text" ref={textRef} />
        <StyledAddTextBtn onClick={() => addTextToFrames(textRef.current.value)}>Add</StyledAddTextBtn>
      </TextInputForm>
      <br />
      <br />
    </StyledSidebarDiv>
  );
}