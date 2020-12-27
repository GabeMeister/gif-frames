import React from 'react';

export default function ImageLayer({ imageLayerModel }) {
  return (
    <img
      src={imageLayerModel.dataUrl}
      alt={`frame-thumbnail`}
      className="frame-img absolute select-none"
    />
  );
};
