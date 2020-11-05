import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import GifRenderer from './components/GifRenderer';
import gifFrames from 'gif-frames';
import $ from 'jquery';

import './App.css';
import FrameDisplay from './components/FrameDisplay';
import FrameWrapper from './components/FrameReel';
import Frame from './lib/Frame';

const ControlPanel = styled.div`
  position: fixed;

  .copy-btn {
    width: 200px;
    height: 75px;
  }
`;

window.$ = $;

function App() {
  const [gifUrl, setGifUrl] = useState('');
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [delay, setDelay] = useState(50);
  const [rendering, setRendering] = useState(false);
  const gifUrlRef = useRef(null);
  const frameIdxRef = useRef(null);
  const textRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    // SHORT - Wipe out
    // https://media.giphy.com/media/3o7aD0ILhi08LGF1PG/giphy.gif

    if (gifUrl === '') {
      return;
    }

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

  }, [gifUrl]);

  useEffect(() => {
    // Setup global hotkey for new frame
    function logKey(e) {
      if (e.code === 'Enter') {
        onCopyClick();
      }
    }
    document.addEventListener('keydown', logKey);

    return () => {
      document.removeEventListener('keydown', logKey);
    };
  }, [frames]);

  function onAddTextClick() {
    const focusedFrame = frames[frameIdx];
    focusedFrame.addText(textRef.current.value);

    setFrames([...frames]);
  }

  function onFrameIdxChange(e) {
    setFrameIdx(parseInt(frameIdxRef.current.value));
  }

  function onTextMove({ frame, index }) {
    let framesCopy = [...frames];
    framesCopy[index] = frame;
    setFrames(framesCopy);
  }

  const onCopyClick = useCallback(() => {
    // Can't copy last frame to the next one
    if (frameIdx >= frames.length - 1) {
      return;
    }

    let framesCopy = [...frames];
    let frameToCopy = framesCopy[frameIdx];
    let textListToCopy = frameToCopy.textList.map(x => ({ ...x }));
    framesCopy[frameIdx + 1].textList = textListToCopy;
    setFrames(framesCopy);
    setFrameIdx(frameIdx + 1);
  });

  function onRenderClick() {
    setRendering(true);
  }

  function onRenderFinish() {
    setRendering(false);
  }

  function onGifUrlEntered() {
    setGifUrl(gifUrlRef.current.value);
  }

  return (
    <div className="App">
      <ControlPanel>
        <h1>Gif Url:</h1>
        <input ref={gifUrlRef} type="text" />{' '}
        <button onClick={onGifUrlEntered}>Enter</button>
        <br />
        <br />
        <h1>Text:</h1>
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
        <button onClick={() => onCopyClick()} className="copy-btn">Copy Current Frame</button>
        <br />
        <br />
        <button onClick={() => onRenderClick()}>Render Gif</button>
        <br />
        <br />
        <h1>Frame Delay (in ms):</h1>
        <input
          ref={delayRef}
          type="number"
          value={delay}
          onChange={() => setDelay(parseInt(delayRef.current.value))}
        />
        <br />
        <br />
        <h1>Frame index {frameIdx} out of {frames.length - 1}</h1>
      </ControlPanel>
      <br />
      <FrameWrapper>
        {!!frames.length && (
          <FrameDisplay
            key={frames[frameIdx].getHash()}
            index={frameIdx}
            frameData={frames[frameIdx]}
            onTextMove={onTextMove}
          />
        )}
      </FrameWrapper>
      {rendering && (
        <GifRenderer frames={frames} onFinish={onRenderFinish} delay={delay} />
      )}
    </div>
  );
}

export default App;
