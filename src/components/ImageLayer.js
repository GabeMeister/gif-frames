import React from 'react';

export default function ImageLayer({ imageLayerModel }) {
  return (
    <img
      src={imageLayerModel.dataUrl}
      alt={`frame-thumbnail`}
      className="js-frame-img select-none m-auto"
    />
  );
};
