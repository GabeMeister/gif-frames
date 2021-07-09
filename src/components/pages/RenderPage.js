import React, { useEffect, useState, useCallback } from "react";
import styled from 'styled-components';
import { useRecoilValue } from "recoil";

import framesState from "../../components/state/atoms/framesState";
import Button from "../Button";
import RenderPageSidebar from '../RenderPageSidebar';
import delayState from "../state/atoms/delayState";
import fontSizeState from "../state/atoms/fontSizeState";

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
  const fontSize = useRecoilValue(fontSizeState);

  const renderGif = useCallback(() => {
    var gif = new window.GIF({
      workers: 2,
      quality: 10
    });

    let renderTasks = [];
    for (let i = 0; i < frames.length; i++) {
      // Create new canvas to stuff everything in
      const currentFrame = document.createElement('canvas');
      currentFrame.width = frames[i].imageLayerData.width;
      currentFrame.height = frames[i].imageLayerData.height;
      const ctx = currentFrame.getContext('2d');

      // Setup the font style
      ctx.font = `${fontSize}px Impact, Charcoal, sans-serif`;

      // Images take a little bit to load, so we have to use promises cause the
      // picture isn't guaranteed to be done loading when we do things
      // synchronously
      let task = new Promise((resolve, reject) => {
        // Add image to the canvas
        const img = document.createElement('img');
        img.src = frames[i].imageLayerData.dataUrl;
        img.onload = function(evt) {
          ctx.drawImage(img, 0, 0);

          // Add text to the canvas
          frames[i].textLayerData.textList.forEach(t => {
            ctx.fillStyle = t.color;
            ctx.fillText(t.text, t.x, t.y);
          });

          gif.addFrame(currentFrame, {
            delay: delay
          });

          resolve();
        }
      });

      renderTasks.push(task);
    }

    gif.on('finished', function (blob) {
      setLoading(false);
      setBlobUrl(URL.createObjectURL(blob));
    });

    Promise.all(renderTasks).then(() => {
      gif.render();
    });
  }, [delay, fontSize, frames]);

  function downloadGif(url) {
    // Create "hidden" link, click it to download the gif, then remove the link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finished.gif");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    setLoading(true);
    renderGif();
  }, [delay, renderGif]);
  
  return (
    <StyledRenderPageDiv>
      <RenderPageSidebar />
      {loading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : (
        <>
          <img src={blobUrl} alt="preview-gif" />
          <br />
          <Button onClick={() => downloadGif(blobUrl)}>Download</Button>
        </>
      )}
    </StyledRenderPageDiv>
  );
}
