import React, { useState, useCallback } from "react";
import styled from 'styled-components';
import { useRecoilValue } from "recoil";
import Animated_GIF from 'animated_gif';

import delayState from "../state/atoms/delayState";

const StyledTempPageDiv = styled.div`
  width: 1024px;
  background-color: lightgray;
  margin: auto;
  height: 100vh;
  box-sizing: border-box;
  padding: 10px;
`;

export default function RenderPage() {
  const delay = useRecoilValue(delayState);
  const [blobUrl, setBlobUrl] = useState('');

  const renderGif = useCallback(() => {


    /*
     * gif.js TOO SLOW AND RESOURCE INTENSIVE UNLESS NUMBER OF WORKERS IS
     * ADJUSTED
     */
    
    // var gif = new window.GIF({
    //   workers: 2,
    //   quality: 10
    // });

    // let renderTasks = [];
    // for (let i = 0; i < frames.length; i++) {
    //   // Create new canvas to stuff everything in
    //   const currentFrame = document.createElement('canvas');
    //   currentFrame.width = frames[i].imageLayerData.width;
    //   currentFrame.height = frames[i].imageLayerData.height;
    //   const ctx = currentFrame.getContext('2d');

    //   // Images take a little bit to load, so we have to use promises cause the
    //   // picture isn't guaranteed to be done loading when we do things
    //   // synchronously
    //   let task = new Promise((resolve, reject) => {
    //     // Add image to the canvas
    //     const img = document.createElement('img');
    //     img.src = frames[i].imageLayerData.dataUrl;
    //     img.onload = function(evt) {
    //       ctx.drawImage(img, 0, 0);

    //       // Add text to the canvas
    //       frames[i].textLayerData.textList.forEach(textData => {
    //         drawTextOnCanvas(ctx, textData, fontSize);
    //       });

    //       gif.addFrame(currentFrame, {
    //         delay: delay
    //       });

    //       resolve();
    //     }
    //   });

    //   renderTasks.push(task);
    // }

    // gif.on('finished', function (blob) {
    //   setLoading(false);
    //   console.log('***** blob *****', blob);
    //   setBlobUrl(URL.createObjectURL(blob));
    // });

    // Promise.all(renderTasks).then(() => {
    //   gif.render();
    // });
    
    







    /*
     * jsgif - DOESNT WORK WITH IMAGES RIGHT
     */

    // var encoder = new window.GIFEncoder();
    // encoder.setRepeat(0); // loop forever
    // encoder.setDelay(delay); // delay in milliseconds until next frame
    // encoder.setSize(200, 200);
    // encoder.start();
    
    // const currentFrame = document.createElement('canvas');
    // const ctx = currentFrame.getContext('2d');
    


    // const testImg = document.getElementById('test_image');
    // ctx.drawImage(testImg, 0, 0);

    // encoder.addFrame(ctx.getImageData(0, 0, 200, 200), true);

    
    // // ctx.fillStyle = `rgb(${Math.random() * 255},255,255)`;
    // // ctx.fillRect(0,0,200,200); //GIF can't do transparent so do white
    
    // // ctx.fillStyle = "rgb(200,0,0)";  
    // // ctx.fillRect(10, 10, Math.random() * 255, 50);

    // document.body.appendChild(currentFrame);
    
    // // encoder.addFrame(ctx);
    // encoder.finish();
    
    // var binaryGif = encoder.stream().getData();
    // var url = 'data:image/gif;base64,'+window.encode64(binaryGif);
    
    // console.log('***** url *****', url);
    // setBlobUrl(url);






    /*
     * Animated_GIF
     */
    let ag = new window.Animated_GIF();
    ag.setDelay(1); 
    ag.setSize(100, 1000);

    const testImg = document.getElementById('test_image');
    ag.addFrame(testImg);
    
    const testImg2 = document.getElementById('test_image2');
    ag.addFrame(testImg2);

    ag.getBase64GIF(img => {
      const newImg = document.createElement('img');
      newImg.src = img;
      document.querySelector('#final').appendChild(newImg);
    });





  }, [delay]);

  function downloadGif(url) {
    // Create "hidden" link, click it to download the gif, then remove the link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "finished.gif");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return (
    <StyledTempPageDiv>
      <div id="final"></div>
      <img id="test_image" style={{width: '300px'}} src="Kobe_Bryant.jpg" alt="temp" />
      <img id="test_image2" style={{width: '300px', position: 'absolute', right: 0 }} src="lebron.jpg" alt="temp2" />
      <br />
      <button onClick={renderGif}>Click</button>
      <br />
      <br />
      <br />
      <h2>Blob url:</h2>
      {blobUrl}
      <br />
      <br />
      <button onClick={() => downloadGif(blobUrl)}>Download</button>
    </StyledTempPageDiv>
  );
}
