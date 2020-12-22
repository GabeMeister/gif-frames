import React from 'react';

export default function FrameWrapper({ children }) {
  return (
    <div className="absolute w-1/2 h-full top-0 right-0">{children}</div>
  );
};
