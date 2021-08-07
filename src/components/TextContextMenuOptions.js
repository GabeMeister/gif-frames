import React from 'react';
import styled from 'styled-components';

const StyledTextContextMenuOptions = styled.div`
  background-color: white;
  padding: 12px;
  font-size: 24px;
  line-height: 36px;
  cursor: pointer;
`;

const MenuItem = styled.div`
  &:hover {
    color: #4d82ff;
  }
`;

const BoldedText = styled.span`
  font-weight: bold;
`;

const ItalicizedText = styled.span`
  font-style: italic;
`;

export default function TextContextMenuOptions({ onDeleteAllClick, onHideBeforeClick, onHideAfterClick }) {
  return (
    <StyledTextContextMenuOptions>
      <MenuItem onClick={onDeleteAllClick}>Delete from <BoldedText>ALL</BoldedText> frames</MenuItem>
      <MenuItem onClick={onHideBeforeClick}>Hide <ItalicizedText>before</ItalicizedText> this frame</MenuItem>
      <MenuItem onClick={onHideAfterClick}>Hide <ItalicizedText>after</ItalicizedText> this frame</MenuItem>
    </StyledTextContextMenuOptions>
  );
}