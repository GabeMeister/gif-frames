import React from 'react';

export default function FrameImg({ frameData }) {
  return (
    <img
      src={frameData.dataUrl}
      alt={`frame-thumbnail`}
      className="frame-img absolute select-none"
    />
  );
};
