import React, { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import GifRenderer from './components/GifRenderer';
import gifFrames from 'gif-frames';
import $ from 'jquery';
import cloneDeep from 'lodash.clonedeep';

import './App.css';
import FrameDisplay from './components/FrameDisplay';
import FrameWrapper from './components/FrameReel';
import Frame from './lib/Frame';

const ControlPanel = styled.div`
  position: fixed;
  margin: 30px;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 3px;

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
  const [fontSize, setFontSize] = useState(32);
  const [rendering, setRendering] = useState(false);
  const gifUrlRef = useRef(null);
  const frameIdxRef = useRef(null);
  const textRef = useRef(null);
  const delayRef = useRef(null);
  const fontSizeRef = useRef(null);

  const onCopyClick = useCallback(() => {
    // Can't copy last frame to the next one
    if (frameIdx >= frames.length - 1) {
      return;
    }

    let framesCopy = cloneDeep(frames);
    framesCopy[frameIdx + 1].textList = cloneDeep(framesCopy[frameIdx].textList);

    setFrames(framesCopy);
    setFrameIdx(frameIdx + 1);
  }, [frames, frameIdx]);

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
  }, [frames, onCopyClick]);

  useEffect(() => {
    setFrames(frames => {
      for (let i = 0; i < frames.length; i++) {
        frames[i].fontSize = cloneDeep(fontSize);
      }
      return frames;
    });
  }, [fontSize]);

  function fetchGifContents() {
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
        return Frame.initFromCanvas({ canvas: frame, fontSize });
      });

      setFrames(frameData);
    });
  }

  function onAddTextClick() {
    const framesCopy = cloneDeep(frames);
    framesCopy[frameIdx].addText(textRef.current.value);

    setFrames(framesCopy);
  }

  function onFrameIdxChange(e) {
    setFrameIdx(parseInt(frameIdxRef.current.value));
  }

  function onTextMove({ frame, index }) {
    let framesCopy = cloneDeep(frames);
    framesCopy[index] = frame;
    setFrames(framesCopy);
  }

  function onRenderClick() {
    setRendering(true);
  }

  function onRenderFinish() {
    setRendering(false);
  }

  function onFontSizeChange() {
    setFontSize(parseInt(fontSizeRef.current.value));
  }

  return (
    <div className="App">
      <ControlPanel>
        <h1>Gif Url:</h1>
        <input ref={gifUrlRef} type="text" value={gifUrl} onChange={() => setGifUrl(gifUrlRef.current.value)} />{' '}
        <button onClick={fetchGifContents}>Enter</button>
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
        <h1>Font Size (in px):</h1>
        <input
          ref={fontSizeRef}
          type="number"
          value={fontSize}
          onChange={onFontSizeChange}
        />
        <br />
        <br />
        <button onClick={() => onCopyClick()} className="copy-btn">Copy Current Frame</button>
        <br />
        <br />
        <h1>Frame index {frameIdx} out of {frames.length - 1}</h1>
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
        <button onClick={() => onRenderClick()}>Render Gif</button>
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
        <GifRenderer frames={frames} onFinish={onRenderFinish} delay={delay} fontSize={fontSize} />
      )}
    </div>
  );
}

export default App;
