import React, { useState } from 'react';
import styled from 'styled-components';
import Spacer from './Spacer';

const StyledRadioTab = styled.div`
  max-width: 100%;
  margin: auto;
`;

const StyledRadioButtonsList = styled.div`
  display: flex;
`;

const StyledRadioButtonWrapper = styled.div`
  margin-right: 10px;
`;

const StyledRadioInput = styled.input`
  margin-right: 5px;
  cursor: pointer;
`;

const StyledLabel = styled.label`
  cursor: pointer;
`;

export default function RadioTab({ options }) {
  const [method, setMethod] = useState(options[0].name);

  return (
    <StyledRadioTab className="__StyledRadioTab">
      <StyledRadioButtonsList className="__StyledRadioButtonsList">
        {options.map(option => {
          return (
            <StyledRadioButtonWrapper className="__StyledRadioButtonWrapper" key={option.name}>
              <StyledRadioInput
                type="radio"
                name="gif_input_method"
                value={option.name}
                checked={method === option.name}
                onChange={() => setMethod(option.name)}
              />
              <StyledLabel
                htmlFor="gif_input_method"
                onClick={() => setMethod(option.name)}
              >
                {option.displayName}
              </StyledLabel>
            </StyledRadioButtonWrapper>
          );
        })}
      </StyledRadioButtonsList>
      <Spacer height="14px" />
      <div>
        {options.find(x => x.name === method).content}
      </div>
    </StyledRadioTab>
  );
};
