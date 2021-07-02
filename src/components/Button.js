import styled from 'styled-components';

const btn = styled.button`
  background-color: ${props => props.color || 'lightgreen'};
  padding: 7px;
  border-radius: 3px;
`;

export default btn;