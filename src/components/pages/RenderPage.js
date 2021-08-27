import React, { useEffect, useState, useCallback } from "react";
import styled from 'styled-components';
import { useRecoilValue } from "recoil";

import framesState from "../../components/state/atoms/framesState";
import Button from "../Button";
import RenderPageSidebar from '../RenderPageSidebar';
import delayState from "../state/atoms/delayState";
import fontSizeState from "../state/atoms/fontSizeState";
import { drawTextOnCanvas } from "../lib/fonts";
import LoadingAnimation from "../LoadingAnimation";

const StyledRenderPage = styled.div`
  width: 100%;
  margin: auto;
  height: 100vh;
  display: flex;
`;

const StyledPreviewImg = styled.img`
  border-radius: 3px;
`;

const StyledLoadingAnimation = styled.div`
  text-align: center;
  flex-grow: 1;
  padding-top: 50px;
`;

const StyledPreviewArea = styled.div`
  flex-grow: 1;
  text-align: center;
  margin-top: 30px;
`;

const DownloadButton = styled(Button)`
  font-size: 18px;
  padding: 8px 16px;
  margin-top: 30px;
`;

export default function RenderPage() {
  const frames = useRecoilValue(framesState);
  const delay = useRecoilValue(delayState);
  const [loading, setLoading] = useState(true);
  const [blobUrl, setBlobUrl] = useState('');
  const fontSize = useRecoilValue(fontSizeState);

  const renderGif = useCallback(() => {
    var gif = new window.GIF({
      workers: 10,
      quality: 1
    });

    let renderTasks = [];
    for (let i = 0; i < frames.length; i++) {
      // Create new canvas to stuff everything in
      const currentFrame = document.createElement('canvas');
      currentFrame.width = frames[i].imageLayerData.width;
      currentFrame.height = frames[i].imageLayerData.height;
      const ctx = currentFrame.getContext('2d');

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
          frames[i].getVisibleTextList().forEach(textData => {
            drawTextOnCanvas(ctx, textData, fontSize);
          });

          resolve(currentFrame);
        }
      });

      renderTasks.push(task);
    }

    gif.on('finished', function (blob) {
      setLoading(false);
      setBlobUrl(URL.createObjectURL(blob));
    });

    Promise.all(renderTasks).then(allCanvases => {
      allCanvases.forEach(c => {
        gif.addFrame(c, {
          delay: delay
        });
      });
      
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
    <StyledRenderPage className="__StyledRenderPage">
      <RenderPageSidebar />
      {loading ? (
        <StyledLoadingAnimation className="__StyledLoadingAnimation">
          <LoadingAnimation />
        </StyledLoadingAnimation>
      ) : (
        <StyledPreviewArea>
          <StyledPreviewImg src={blobUrl} alt="preview-gif" />
          <br />
          <DownloadButton onClick={() => downloadGif(blobUrl)}>Download</DownloadButton>
        </StyledPreviewArea>
      )}
    </StyledRenderPage>
  );
}
