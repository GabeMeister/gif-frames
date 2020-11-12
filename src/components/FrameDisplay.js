import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

const FrameDisplayWrapper = styled.div`
  color: red;
  position: relative;

  .frame-canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .frame-label {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default function FrameDisplay({ index, frameData, onTextMove = () => { } }) {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(frameData);
  const [mouseDown, setMouseDown] = useState(false);
  const [coord, setCoord] = useState({ x: -1, y: -1 });
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
  const [canvasTextList, setCanvasTextList] = useState([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Setup the font style
    ctx.fillStyle = 'red';
    ctx.font = `${frameData.fontSize}px Impact, Charcoal, sans-serif`;

    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, frame.width, frame.height);

    const canvasTexts = frame.textList.map(text => {
      return {
        ...text,
        height: frameData.fontSize,
        width: ctx.measureText(text.text).width
      };
    });

    // Iterate through the texts and paint them on
    canvasTexts.forEach(text => {
      ctx.fillText(text.text, text.x, text.y);
    });

    setCanvasTextList(canvasTexts);
  }, [frame, frameData.fontSize]);

  function isTextClicked(text, x, y) {
    return (
      x >= text.x
      && x <= (text.x + text.width)
      && (y >= text.y - text.height)
      && y <= text.y
    );
  }

  function onMouseDown(e) {
    setMouseDown(true);

    const pos = getMousePos(canvasRef.current, e);

    const index = canvasTextList.findIndex(text => isTextClicked(text, pos.x, pos.y));
    if (index >= 0) {
      setSelectedTextIndex(index);

      setCoord({
        x: pos.x,
        y: pos.y
      });
    }
  }

  function onMouseUp(e) {
    setMouseDown(false);
    setSelectedTextIndex(-1);
    setCoord({
      x: -1,
      y: -1
    });

    onTextMove({
      frame,
      index
    });
  }

  function onMouseMove(e) {
    if (mouseDown && selectedTextIndex >= 0) {
      let frameClone = Object.assign(Object.create(Object.getPrototypeOf(frame)), frame)
      const pos = getMousePos(canvasRef.current, e);

      const xChange = pos.x - coord.x;
      const yChange = pos.y - coord.y;

      frameClone.textList[selectedTextIndex].x += xChange;
      frameClone.textList[selectedTextIndex].y += yChange;

      setCoord({
        x: pos.x,
        y: pos.y
      });

      setFrame(frameClone);
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  return (
    <FrameDisplayWrapper className="frame-wrapper">
      <img className="frame-img" src={frame.dataUrl} alt={`thumbnail${index}`} />
      <canvas
        id={frame.getHash()}
        className="frame-canvas"
        ref={canvasRef}
        height={frame.height}
        width={frame.width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      />
    </FrameDisplayWrapper>
  );
};
