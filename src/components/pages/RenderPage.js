import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useRecoilValue } from "recoil";

import framesState from "../../components/state/atoms/framesState";
import Button from "../Button";
import GifRenderer from "../GifRenderer";
import RenderPageSidebar from '../RenderPageSidebar';
import delayState from "../state/atoms/delayState";

const StyledRenderPageDiv = styled.div`
  width: 1024px;
  background-color: lightgray;
  margin: auto;
  height: 100vh;
  box-sizing: border-box;
  padding: 10px;
`;

export default function RenderPage() {
  const frames = useRecoilValue(framesState);
  const delay = useRecoilValue(delayState);
  const [loading, setLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState('');

  function onRenderFinish(url) {
    setLoading(false);
    setBlobUrl(url);
  }

  function downloadGif() {
    // Create "hidden" link, click it to download the gif, then remove the link
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "finished.gif");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    setLoading(true);
  }, [delay]);
  
  return (
    <StyledRenderPageDiv>
      <RenderPageSidebar />
      {loading ? (
        <>
          <GifRenderer
            frames={frames}
            onFinish={onRenderFinish}
            delay={delay}
          />
          <h1>Loading...</h1>
        </>
      ) : (
        <>
          <img src={blobUrl} alt="preview-gif" />
          <br />
          <Button onClick={downloadGif}>Download</Button>
        </>
      )}
    </StyledRenderPageDiv>
  );
}
