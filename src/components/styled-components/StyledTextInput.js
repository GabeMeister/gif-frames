import styled from 'styled-components';

const StyledTextInput = styled.input`
  margin-right: 5px;
  flex-grow: 1;
  line-height: 36px;
  outline: none;
  border-radius: 3px;
  border: 1px solid #c4c4c4;
  padding-left: 10px;
  color: #454545;
  font-size: 14px;

  &:focus {
    border: 1px solid #4778ff;
  }
`;

export default StyledTextInput;