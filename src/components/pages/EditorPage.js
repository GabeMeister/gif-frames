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
import GifRenderer from '../GifRenderer';
import PreviewModal from '../Modal';
import FrameModel from '../../models/FrameModel';
import TextLayerModel from '../../models/TextLayerModel';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EditorPage() {
  let query = useQuery();
  const [delay, setDelay] = useState(100);
  const [autoplayDelay, setAutoplayDelay] = useState(delay);
  const [framesModel, setFramesModel] = useState([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [fontSize, setFontSize] = useState(32);
  const [rendering, setRendering] = useState(false);
  const [previewRendering, setPreviewRendering] = useState(false);
  const [autoplaying, setAutoplaying] = useState(false);
  const [isTextLayerLocked, setIsTextLayerLocked] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [autoplayCounter, setAutoplayCounter] = useState(3);
  const editorRef = useRef(null);
  const textRef = useRef(null);
  const delayRef = useRef(null);
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
    // Have to focus the editor when it loads so the keydown press works
    editorRef.current.focus();
  }, []);

  useEffect(() => {
    setAutoplayDelay(delay);
  }, [delay, setAutoplayDelay]);

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
    if (framesModel.length) {
      textLayerModelRef.current.fontSize = fontSize;
    }

    setFramesModel(frames => {
      for (let i = 0; i < framesModel.length; i++) {
        framesModel[i].textLayerModel.fontSize = cloneDeep(fontSize);
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
          setIsTextLayerLocked(false);
        }
      }, autoplayDelay);
    }

    return () => clearInterval(id);
  }, [autoplaying, autoplayCounter, onFrameSubmit, frameIdx, framesModel.length, autoplayDelay]);

  function onKeyDown(e) {
    // Setup global hotkey for creating a new frame
    if (e.keyCode === 13 && e.target.nodeName === 'DIV') {
      e.preventDefault();
      onFrameSubmit();
    }

    // Setup global hotkey for beginning autoplay
    // Make sure target was from a div because people sometimes still want to type spaces in inputs
    if (e.keyCode === 32 && e.target.nodeName === 'DIV') {
      e.preventDefault();

      // If we are at the end, automatically restart from the beginning
      if (frameIdx === framesModel.length - 1) {
        setFrameIdx(0);
      }
      setAutoplaying(!autoplaying);
    }
  }

  function onAddTextClick() {
    const newText = textRef.current.value;
    const textLayerModelCopy = cloneDeep(textLayerModelRef.current);

    textLayerModelCopy.addText(newText);
    textLayerModelRef.current = textLayerModelCopy;

    textRef.current.value = '';

    forceUpdate();
  }

  function onFrameIdxChange(newFrameIdx) {
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

  function onPreviewRenderClick() {
    // Make sure we render the current frame we are on (typically the last one)
    renderCurrentFrame();

    setPreviewRendering(true);
  }

  function onPreviewRenderFinish(url) {
    setPreviewRendering(false);
    setPreviewUrl(url);
    setPreviewModalOpen(true);
  }

  function onRenderFinish(url) {
    setRendering(false);

    // Create "hidden" link, click it to download the gif, then remove the link
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'finished.gif');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function onFontSizeChange() {
    if (parseInt(fontSizeRef.current.value)) {
      setFontSize(parseInt(fontSizeRef.current.value));
    }
  }

  function onPreviewClose() {
    setPreviewModalOpen(false);
  }

  return (
    <div
      id="editor"
      ref={editorRef}
      tabIndex="0"
      className="h-screen outline-none"
      onKeyDown={onKeyDown}
    >
      {gifUrl ? (
        <div className="flex justify-center mt-16">
          <div className="absolute top-3 left-3">
            <Link to="/">
              <button className="bg-red-400 p-2.5 rounded">
                ← Completely Restart
                </button>
            </Link>
          </div>
          <div className="p-6" style={{ minWidth: '500px' }}>
            <div className="flex items-center justify-between">
              {!!framesModel.length && (
                <>
                  <div>
                    <button
                      onClick={() => {
                        // If we are at the end, automatically restart from the beginning
                        if (frameIdx === framesModel.length - 1) {
                          setFrameIdx(0);
                        }
                        setAutoplaying(!autoplaying);
                      }}
                      className={`${autoplaying ? 'bg-yellow-500' : 'bg-green-500'} p-2.5 rounded`}
                    >
                      <img
                        alt="play"
                        src={`${autoplaying ? 'pause.png' : 'play.png'}`} className="w-4 inline"
                      />
                      <div className="inline-block ml-1">{autoplaying ? 'Pause' : 'Play'}</div>
                    </button>
                    <button
                      onClick={() => {
                        setIsTextLayerLocked(!isTextLayerLocked);
                      }}
                      className={`${isTextLayerLocked ? 'bg-gray-400' : 'bg-blue-400'} p-3 rounded ml-3`}
                    >
                      <div className="inline-block">{isTextLayerLocked ? 'Stop Editing' : 'Edit'}</div>
                    </button>
                  </div>
                  <button
                    onClick={() => onFrameSubmit()}
                    className="bg-blue-300 p-2.5 rounded"
                  >Copy Text to Next Frame →</button>
                </>
              )
              }
            </div>
            {!!framesModel.length ? (
              <div className="relative mt-6 mb-6">
                <ImageLayer
                  key={`img-${framesModel[frameIdx].getHash()}`}
                  imageLayerModel={framesModel[frameIdx].imageLayerModel}
                />
                <div className="absolute top-0 left-0 w-full">
                  <TextLayer
                    // We want to re-render the text layer when we (1) add some new
                    // text, (2) change the font size or (3) adjust the frame index
                    // when NOT autoplaying
                    // key={``}
                    // key={`${textLayerModelRef.current.textList.length}-${textLayerModelRef.current.fontSize}`}
                    key={isTextLayerLocked ? 'locked' : `${textLayerModelRef.current.textList.length}-${textLayerModelRef.current.fontSize}-${!autoplaying ? frameIdx : ''}`}
                    textLayerModel={textLayerModelRef.current}
                    onTextMove={onTextMove}
                    isLocked={isTextLayerLocked}
                  />
                </div>
                <div className="flex justify-center items-center mt-3">
                  <img
                    className="w-8 mr-3 cursor-pointer"
                    src="double-arrow-left.png"
                    alt="double-arrow-left"
                    onClick={() => onFrameIdxChange(0)}
                  />
                  <div className="arrow-left" onClick={() => onFrameIdxChange(frameIdx - 1)}></div>
                  <h1 className="mr-3 ml-3">{frameIdx + 1} / {framesModel.length}</h1>
                  <div className="arrow-right" onClick={() => onFrameIdxChange(frameIdx + 1)}></div>
                  <img
                    className="w-8 ml-3 cursor-pointer"
                    src="double-arrow-right.png"
                    alt="double-arrow-left"
                    onClick={() => onFrameIdxChange(framesModel.length - 1)}
                  />
                </div>
              </div>
            ) : (
                <img alt="loading-spinner" src="spinner.gif" className="ml-auto mr-auto mt-20 mb-20" />
              )}
            <div className="">
              <div className="flex">
                <div className="text-2xl inline-block flex-none">Add Text:</div>
                <input
                  ref={textRef}
                  type="text"
                  className="pl-1 p-0.5 border-b-2 outline-none focus:border-blue-300 mr-3 ml-3 text-2xl"
                />
                <button
                  onClick={() => onAddTextClick()}
                  className="bg-blue-300 p-2.5 rounded flex-none"
                >Add</button>
              </div>
              <div className="mt-3">
                <div className="text-2xl inline-block w-60 flex-none">Font Size:</div>
                <input
                  ref={fontSizeRef}
                  type="number"
                  value={fontSize}
                  onChange={onFontSizeChange}
                  className="pl-3 border-b-2 outline-none focus:border-blue-300 flex-none mr-3 ml-3 w-24 text-2xl text-center"
                />
                <span className="text-2xl">px</span>
              </div>
              <div className="text-2xl mt-3 inline-block w-60 flex-none">Final Gif Speed:</div>
              <input
                ref={delayRef}
                type="number"
                value={delay}
                onChange={() => setDelay(parseInt(delayRef.current.value))}
                className="pl-3 border-b-2 text-2xl outline-none focus:border-blue-300 ml-3 mr-3 w-24 text-center"
              />
              <span className="text-2xl mt-3">ms</span>
            </div>
            <br />
            <div className="flex">
              <button
                onClick={() => onPreviewRenderClick()}
                className={`bg-gray-200 p-4 text-xl rounded mt-6 block m-auto w-40`}
              >
                {previewRendering
                  ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
                  : <span>Preview</span>
                }
              </button>
              <button
                onClick={() => onRenderClick()}
                className={`${rendering ? 'bg-gray-500' : 'bg-green-500'} p-4 text-xl rounded mt-6 block m-auto w-40`}
              >
                {rendering
                  ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
                  : <span>Download</span>
                }
              </button>
            </div>
          </div>
          { previewModalOpen && (
            <PreviewModal onClose={onPreviewClose}>
              <img className="mx-auto" src={previewUrl} alt="preview-gif" />
            </PreviewModal>
          )}
          { rendering && (
            <GifRenderer
              framesModel={framesModel}
              onFinish={url => onRenderFinish(url)}
              delay={delay}
              fontSize={fontSize}
            />
          )}
          { previewRendering && (
            <GifRenderer
              framesModel={framesModel}
              onFinish={url => onPreviewRenderFinish(url)}
              delay={delay}
              fontSize={fontSize}
            />
          )}
        </div >
      ) : (
          <Redirect to="/" />
        )
      }
    </div>
  );
}
