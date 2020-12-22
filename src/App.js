import React, { useRef, useEffect, useState, useCallback } from 'react';
import 'tailwindcss/tailwind.css';
import gifFrames from 'gif-frames';
import $ from 'jquery';
import cloneDeep from 'lodash.clonedeep';

import './App.css';
import FrameImg from './components/FrameImg';
import FrameCanvas from './components/FrameCanvas';
import RightHalf from './components/RightHalf';
import Frame from './lib/Frame';
import GifRenderer from './components/GifRenderer';

window.$ = $;

function App() {
  const [gifUrl, setGifUrl] = useState('');
  const [frames, setFrames] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [delay, setDelay] = useState(50);
  const [fontSize, setFontSize] = useState(32);
  const [rendering, setRendering] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [autoplaying, setAutoplaying] = useState(false);
  const [autoplayCounter, setAutoplayCounter] = useState(3);
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

  useEffect(() => {
    let id = 0;

    if (autoplaying) {
      id = setInterval(() => {
        // Change frame on GO (3, 2, 1...GO)
        const frameChanging = autoplayCounter === 0;

        // If we aren't changing the frame, then we just decrement the counter
        if (!frameChanging) {
          setAutoplayCounter(c => (c - 1));
        }
        // We are changing the frame
        else if (frameChanging && frameIdx < frames.length - 1) {
          setAutoplayCounter(c => (c + 3));
          onCopyClick();
        }
        // We reached the final frame
        else if (frameChanging && frameIdx === frames.length - 1) {
          clearInterval(id);
          setAutoplaying(a => !a);
        }
      }, 150);
    }

    return () => clearInterval(id);
  }, [autoplaying, autoplayCounter, onCopyClick, frameIdx, frames.length]);

  function fetchGifContents() {
    // SHORT - Wipe out
    // https://media.giphy.com/media/3o7aD0ILhi08LGF1PG/giphy.gif

    if (gifUrl === '') {
      return;
    }

    setFetchLoading(true);

    gifFrames({
      url: gifUrl,
      frames: 'all',
      outputType: 'canvas',
      cumulative: true
    }).then(frameData => {
      frameData = frameData.map(canvas => {
        return Frame.initFromCanvas({ canvas, fontSize });
      });

      setFrames(frameData);
      setFetchLoading(false);
    });
  }

  function onAddTextClick() {
    const framesCopy = cloneDeep(frames);
    framesCopy[frameIdx].addText(textRef.current.value);

    setFrames(framesCopy);
  }

  function onFrameIdxChange(e) {
    const newFrameIdx = parseInt(frameIdxRef.current.value) - 1;

    if (newFrameIdx >= 0 && newFrameIdx < frames.length) {
      setFrameIdx(newFrameIdx);
    }
  }

  function onTextMove({ frame, index }) {
    let framesCopy = cloneDeep(frames);
    framesCopy[index] = frame;
    setFrames(framesCopy);
  }

  function onRenderClick() {
    console.log('setting rendering...');
    setRendering(true);
    console.log('after');
  }

  function onRenderFinish() {
    setRendering(false);
  }

  function onFontSizeChange() {
    setFontSize(parseInt(fontSizeRef.current.value));
  }

  return (
    <div className="App font-sans">
      <div className="p-6">
        <h1 className="text-2xl">Gif Url:</h1>
        <input
          ref={gifUrlRef}
          type="text"
          value={gifUrl}
          onChange={() => setGifUrl(gifUrlRef.current.value)}
          className="pt-2 pb-2 border-b-2 outline-none focus:border-blue-300 mr-3"
        />{' '}
        <button
          onClick={fetchGifContents}
          className={`${fetchLoading ? 'disabled:opacity-50 bg-gray-300' : 'bg-blue-300'} p-2.5 rounded`}
        >
          {fetchLoading
            ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
            : <span>Enter</span>
          }
        </button>
        <br />
        <br />
        <h1 className="text-2xl">Text:</h1>
        <input
          ref={textRef}
          type="text"
          className="pt-2 pb-2 border-b-2 outline-none focus:border-blue-300  mr-3"
        />
        <button
          onClick={() => onAddTextClick()}
          className="bg-blue-300 p-2.5 rounded"
        >Add Text</button>
        <h1 className="text-2xl">Frame Index:</h1>
        <input
          ref={frameIdxRef}
          type="number"
          value={frameIdx + 1}
          onChange={onFrameIdxChange}
          className="pt-2 pb-2 border-b-2 outline-none focus:border-blue-300 mr-3"
        />
        <br />
        <br />
        <h1 className="text-2xl">Font Size (in px):</h1>
        <input
          ref={fontSizeRef}
          type="number"
          value={fontSize}
          onChange={onFontSizeChange}
          className="pt-2 pb-2 border-b-2 outline-none focus:border-blue-300 mr-3"
        />
        <br />
        <br />
        <button
          onClick={() => onCopyClick()}
          className="bg-blue-300 p-2.5 rounded"
        >Copy Current Frame</button>
        <br />
        <br />
        <h1 className="text-2xl">Frame index {frameIdx + 1} out of {frames.length}</h1>
        <br />
        <h1 className="text-2xl">Frame Delay (in ms):</h1>
        <input
          ref={delayRef}
          type="number"
          value={delay}
          onChange={() => setDelay(parseInt(delayRef.current.value))}
          className="pt-2 pb-2 border-b-2 outline-none focus:border-blue-300 mr-3"
        />
        <br />
        <br />
        <button
          onClick={() => setAutoplaying(!autoplaying)}
          className={`${autoplaying ? 'bg-red-500' : 'bg-blue-300'} p-2.5 rounded`}
        >{autoplaying ? 'Stop Auto-play' : 'Begin Auto-play'}</button>
        <br />
        <br />
        <button
          onClick={() => onRenderClick()}
          className={`${rendering ? 'bg-gray-500' : 'bg-green-500'} p-2.5 rounded`}
        >
          {rendering
            ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
            : <span>Finish</span>
          }
        </button>
      </div>
      <h1 className="absolute text-9xl">{autoplaying ? autoplayCounter : ''}</h1>
      <br />
      <RightHalf>
        {!!frames.length && (
          <div className="p-6">
            <FrameImg
              key={`img-${frames[frameIdx].getHash()}`}
              frameData={frames[frameIdx]}
            />
            <FrameCanvas
              key={`canvas-${frames[frameIdx].getHash()}`}
              index={frameIdx}
              frameData={frames[frameIdx]}
              onTextMove={onTextMove}
            />
          </div>
        )}
      </RightHalf>
      {rendering && (
        <GifRenderer
          frames={frames}
          onFinish={onRenderFinish}
          delay={delay}
          fontSize={fontSize}
        />
      )}
    </div>
  );
}

export default App;
