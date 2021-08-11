import styled from 'styled-components';

const Button = styled.button`
  background-color: #19b888;
  color: white;
  border-radius: 3px;
  box-shadow: 0px;
  padding: 6px 14px;
  cursor: pointer;
  border-width: 0px;
  font-size: 14px;

  &:hover,
  &:focus {
    background-color: #17a67b;
  }
`;

export default Button;