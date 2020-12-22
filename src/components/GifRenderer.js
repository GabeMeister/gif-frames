import React from 'react';
import OnImagesLoaded from 'react-on-images-loaded';
import FrameImg from './FrameImg';
import FrameCanvas from './FrameCanvas';

export default function GifRenderer({ frames, onFinish, delay, fontSize = 32 }) {

  function onAllImagesLoaded() {
    var gif = new window.GIF({
      workers: 2,
      quality: 10
    });

    // iterate through all canvases and images
    const frameImages = document.querySelectorAll('.gif-renderer .frame-img');
    const frameCanvases = document.querySelectorAll('.gif-renderer .frame-canvas');

    for (let i = 0; i < frameCanvases.length; i++) {

      // Create new canvas to stuff everything in
      const final = document.createElement('canvas');
      final.width = frames[0].width;
      final.height = frames[0].height;
      const ctx = final.getContext('2d');

      // Setup the font style
      ctx.fillStyle = 'red';
      ctx.font = `${fontSize}px Impact, Charcoal, sans-serif`;

      // Add image to the canvas
      const img = frameImages[i];
      ctx.drawImage(img, 0, 0);

      // Add text to the canvas
      frames[i].textList.forEach(t => {
        ctx.fillText(t.text, t.x, t.y);
      });

      // Add the final frame
      gif.addFrame(final, {
        delay
      });
    }

    gif.on('finished', function (blob) {
      window.open(URL.createObjectURL(blob));
      onFinish();
    });

    gif.render();
  }

  return (
    <div className="gif-renderer hidden -ml-96">
      <OnImagesLoaded onLoaded={onAllImagesLoaded}>
        {frames.map((f, i) => {
          return (
            <div key={`renderer-frame-${f.getHash()}`}>
              <FrameImg
                key={`renderer-img-${f.getHash()}`}
                index={i}
                frameData={f}
              />
              <FrameCanvas
                key={`renderer-canvas-${f.getHash()}`}
                index={i}
                frameData={f}
              />
            </div>
          );
        })}
      </OnImagesLoaded>
    </div>
  );
};
