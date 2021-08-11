import React from "react";
import styled from 'styled-components';
import useInterval from "../lib/useInterval";

const StyledTestPageDiv = styled.div`
  width: 1024px;
  margin: auto;
  height: 100vh;
  box-sizing: border-box;
  padding: 10px;
`;

export default function TestPage() {
  const { start, stop } = useInterval(() => {
    console.log('new Date(): ', (new Date()).toString());
  }, 50);

  return (
    <StyledTestPageDiv>
      <h1>Yup</h1>
      <br />
      <br />
      <button onClick={stop}>Click to stop</button>
      <br />
      <br />
      <button onClick={start}>Click to start</button>
    </StyledTestPageDiv>
  );
}
