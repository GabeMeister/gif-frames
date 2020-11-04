import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import gifFrames from 'gif-frames';
import $ from 'jquery';

import './App.css';
import FrameDisplay from './components/FrameDisplay';
import FrameWrapper from './components/FrameReel';
import Frame from './lib/Frame';

const ControlPanel = styled.div`
  position: fixed;
`;

window.$ = $;

function App() {
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const frameIdxRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // LONG - Kid getting smacked by pole
    // const gifUrl = 'https://media.giphy.com/media/9D7dO65m63DzIZ2daE/giphy.gif';

    // Wipeout biker
    const gifUrl = 'https://media.giphy.com/media/TgTs90N21TrjdbsfcE/giphy.gif';

    // SHORT - Wipe out
    // const gifUrl = 'https://media.giphy.com/media/3o7aD0ILhi08LGF1PG/giphy.gif';

    gifFrames({
      url: gifUrl,
      frames: 'all',
      outputType: 'canvas',
      cumulative: true
    }).then(frameData => {
      frameData = frameData.map(frame => {
        return Frame.initFromCanvas(frame);
      });

      setFrames(frameData);
    });
  }, []);

  function onAddTextClick() {
    const focusedFrame = frames[frameIdx];
    focusedFrame.addText(textRef.current.value);

    setFrames([...frames]);
  }

  function onFrameIdxChange(e) {
    setFrameIdx(frameIdxRef.current.value);
  }

  function onTextMove({ frame, index }) {
    let framesCopy = [...frames];
    framesCopy[index] = frame;
    setFrames(framesCopy);
  }

  function onCopyClick() {
    let framesCopy = [...frames];
    let frameToCopy = framesCopy[frameIdx];
    let textListToCopy = frameToCopy.textList.map(x => ({ ...x }));
    framesCopy[frameIdx + 1].textList = textListToCopy;
    setFrames(framesCopy);
    setFrameIdx(frameIdx + 1);
  }

  function onRenderClick() {
    var gif = new window.GIF({
      workers: 2,
      quality: 10
    });

    // iterate through all canvases and images
    const frameImages = document.getElementsByClassName('frame-img');
    const frameCanvases = document.getElementsByClassName('frame-canvas');

    for (let i = 0; i < frameCanvases.length; i++) {

      // Create new canvas to stuff everything in
      const final = document.createElement('canvas');
      final.width = frames[0].width;
      final.height = frames[0].height;
      const ctx = final.getContext('2d');

      // Setup the font style
      ctx.fillStyle = 'red';
      ctx.font = `${32}px Impact, Charcoal, sans-serif`;

      // Add image to the canvas
      const img = frameImages[i];
      ctx.drawImage(img, 0, 0);

      // Add text to the canvas
      frames[i].textList.forEach(t => {
        ctx.fillText(t.text, t.x, t.y);
      });

      // Add the final frame
      gif.addFrame(final, {
        delay: 50
      });
    }

    gif.on('finished', function (blob) {
      window.open(URL.createObjectURL(blob));
    });

    gif.render();

    // // Add everything to 
    // let canvas = document.getElementById("text-canvas");
    // let canvasImgUrl = canvas.toDataURL("image/png");
    // let canvasImg2 = document.createElement('img');

    // canvasImg2.onload = () => {
    //   console.log('in onload()');
    //   let canvasImg = document.getElementById('rendered-canvas-img');
    //   let bgImg = document.getElementById('background-img');

    //   // Create a new context
    //   let $tmpCanvas = $(`<canvas id="final-canvas" width="${bgImg.width}" height="${bgImg.height}"></canvas>`);
    //   let ctx = $tmpCanvas.get(0).getContext("2d");

    //   // Add background image first
    //   ctx.drawImage(bgImg, 0, 0);
    //   // Add canvas image second
    //   ctx.drawImage(canvasImg2, 0, 0);

    //   // Convert the whole canvas to an image
    //   let finalCanvasImgUrl = $tmpCanvas.get(0).toDataURL("image/png");

    //   // Download the rendered image
    //   const saveLink = document.createElement('a');
    //   const event = new MouseEvent('click', { bubbles: false, cancelable: false });

    //   saveLink.href = finalCanvasImgUrl;
    //   saveLink.download = 'test.png';
    //   saveLink.dispatchEvent(event);
    // };

    // canvasImg2.src = canvasImgUrl;
    // console.log('right after');
  }

  return (
    <div className="App">
      <ControlPanel>
        <input ref={textRef} type="text" />
        <input
          ref={frameIdxRef}
          type="number"
          value={frameIdx}
          onChange={onFrameIdxChange}
        />
        <br />
        <br />
        <button onClick={() => onAddTextClick()}>Add Text</button>
        <br />
        <br />
        <button onClick={() => onCopyClick()}>Copy Current Frame</button>
        <br />
        <br />
        <button onClick={() => onRenderClick()}>Render Gif</button>
      </ControlPanel>
      <br />
      <FrameWrapper>
        {frames.map((f, i) => {
          return (
            <FrameDisplay
              key={f.getHash()}
              index={i}
              frameData={f}
              onTextMove={onTextMove}
            />
          );
        })}
      </FrameWrapper>

    </div>
  );
}

export default App;
