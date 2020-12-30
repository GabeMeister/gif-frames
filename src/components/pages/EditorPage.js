import React, { useRef, useEffect, useState, useCallback, useReducer } from 'react';
import cloneDeep from 'lodash.clonedeep';
import {
  Link,
  Redirect,
  useLocation
} from 'react-router-dom';
import gifFrames from 'gif-frames';

import ImageLayer from '../ImageLayer';
import TextLayer from '../TextLayer';
import RightHalf from '../RightHalf';
import GifRenderer from '../GifRenderer';
import FrameModel from '../../models/FrameModel';
import TextLayerModel from '../../models/TextLayerModel';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EditorPage() {
  let query = useQuery();
  const [delay, setDelay] = useState(200);
  const [framesModel, setFramesModel] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [fontSize, setFontSize] = useState(32);
  const [rendering, setRendering] = useState(false);
  const [autoplaying, setAutoplaying] = useState(false);
  const [autoplayCounter, setAutoplayCounter] = useState(3);
  const [autoplayDelay, setAutoplayDelay] = useState(200);
  const frameIdxRef = useRef(null);
  const textRef = useRef(null);
  const delayRef = useRef(null);
  const autoplayRef = useRef(null);
  const fontSizeRef = useRef(null);
  const textLayerModelRef = useRef(null);
  const [_, forceUpdate] = useReducer(x => x + 1, 0); // eslint-disable-line no-unused-vars
  const gifUrl = query.get('gifUrl');


  const renderCurrentFrame = useCallback(() => {
    let framesModelCopy = cloneDeep(framesModel);
    framesModelCopy[frameIdx].textLayerModel = cloneDeep(textLayerModelRef.current);

    setFramesModel(framesModelCopy);
  }, [framesModel, frameIdx]);

  const onFrameSubmit = useCallback(() => {
    // Can't copy last frame to the next one
    if (frameIdx >= framesModel.length - 1) {
      return;
    }

    renderCurrentFrame();

    setFrameIdx(frameIdx + 1);
  }, [framesModel, frameIdx, renderCurrentFrame]);

  useEffect(() => {
    // If we don't have a gif url don't do anything, we're about to redirect
    // back to the home page anyway
    if (!gifUrl) {
      return;
    }

    gifFrames({
      url: gifUrl,
      frames: 'all',
      outputType: 'canvas',
      cumulative: true
    }).then(frames => {
      const frameData = frames.map(frame => {
        const canvas = frame.getImage();

        return new FrameModel({ canvas });
      });

      // Set text layer the user will interact with by taking a look at the first frame
      const firstImageFrame = frameData[0].imageLayerModel;
      const initialTextLayerModel = new TextLayerModel({
        height: firstImageFrame.height,
        width: firstImageFrame.width
      });
      textLayerModelRef.current = initialTextLayerModel;

      setFramesModel(frameData);
    });
  }, [gifUrl]);

  useEffect(() => {
    function logKey(e) {
      // Setup global hotkey for creating a new frame
      if (e.code === 'Enter') {
        onFrameSubmit();
      }

      // Setup global hotkey for beginning autoplay
      if (e.code === 'Space') {
        setAutoplaying(!autoplaying);
      }
    }
    document.addEventListener('keydown', logKey);

    return () => {
      document.removeEventListener('keydown', logKey);
    };
  }, [framesModel, onFrameSubmit, autoplaying]);

  useEffect(() => {
    if (framesModel.length) {
      textLayerModelRef.current.fontSize = fontSize;
    }

    setFramesModel(frames => {
      for (let i = 0; i < framesModel.length; i++) {
        framesModel[i].fontSize = cloneDeep(fontSize);
      }
      return frames;
    });
  }, [fontSize, framesModel]);

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
        else if (frameChanging && frameIdx < framesModel.length - 1) {
          setAutoplayCounter(c => (c + 3));
          onFrameSubmit();
        }
        // We reached the final frame
        else if (frameChanging && frameIdx === framesModel.length - 1) {
          clearInterval(id);
          setAutoplaying(a => !a);
        }
      }, autoplayDelay);
    }

    return () => clearInterval(id);
  }, [autoplaying, autoplayCounter, onFrameSubmit, frameIdx, framesModel.length, autoplayDelay]);

  function onAddTextClick() {
    const newText = textRef.current.value;
    const textLayerModelCopy = cloneDeep(textLayerModelRef.current);

    textLayerModelCopy.addText(newText);
    textLayerModelRef.current = cloneDeep(textLayerModelCopy);

    forceUpdate();
  }

  function onFrameIdxChange(e) {
    const newFrameIdx = parseInt(frameIdxRef.current.value) - 1;

    if (newFrameIdx >= 0 && newFrameIdx < framesModel.length) {
      renderCurrentFrame();

      // Set the text list back to match the current frame
      textLayerModelRef.current = cloneDeep(framesModel[newFrameIdx].textLayerModel);

      setFrameIdx(newFrameIdx);
      forceUpdate();
    }
  }

  function onTextMove({ textLayerData }) {
    textLayerModelRef.current = textLayerData;
  }

  function onRenderClick() {
    // Make sure we render the current frame we are on (typically the last one)
    renderCurrentFrame();

    setRendering(true);
  }

  function onRenderFinish() {
    setRendering(false);
  }

  function onFontSizeChange() {
    setFontSize(parseInt(fontSizeRef.current.value));
  }

  return (
    <>
      {gifUrl ? (
        <div className="App font-sans">
          <div className="p-6">
            <Link to="/">
              <button className="bg-blue-300 p-2.5 rounded">
                ← Restart
          </button>
            </Link>
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
              onClick={() => onFrameSubmit()}
              className="bg-blue-300 p-2.5 rounded"
            >Next Frame</button>
            <br />
            <br />
            <h1 className="text-2xl">Frame index {frameIdx + 1} out of {framesModel.length}</h1>
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
            <h1 className="text-2xl">Autoplay Delay (in ms):</h1>
            <input
              ref={autoplayRef}
              type="number"
              value={autoplayDelay}
              onChange={() => setAutoplayDelay(parseInt(autoplayRef.current.value))}
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
                : <span>Finish ✓</span>
              }
            </button>
          </div>
          <h1 className="absolute text-9xl">{autoplaying ? autoplayCounter : ''}</h1>
          <br />
          <RightHalf>
            {!!framesModel.length ? (
              <div className="p-6">
                <ImageLayer
                  key={`img-${framesModel[frameIdx].getHash()}`}
                  imageLayerModel={framesModel[frameIdx].imageLayerModel}
                />
                <TextLayer
                  // We want to re-render the text layer when we (1) add some new
                  // text, (2) change the font size or (3) adjust the frame index
                  // when NOT autoplaying
                  key={`${textLayerModelRef.current.textList.length}-${textLayerModelRef.current.fontSize}-${!autoplaying ? frameIdx : ''}`}
                  textLayerModel={textLayerModelRef.current}
                  onTextMove={onTextMove}
                />
              </div>
            ) : (
                <img alt="loading-spinner" src="spinner.gif" />
              )}
          </RightHalf>
          {rendering && (
            <GifRenderer
              framesModel={framesModel}
              onFinish={onRenderFinish}
              delay={delay}
              fontSize={fontSize}
            />
          )}
        </div>
      ) : (
          <Redirect to="/" />
        )}
    </>
  );
}
