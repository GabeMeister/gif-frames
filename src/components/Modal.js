import React from 'react';

export default function Modal({ children, onClose }) {
  return (
    <div className="absolute left-0 top-0 w-full mt-32">
      <div className="w-3/4 mx-auto rounded-md pb-6 pl-3 bg-gray-200 border-solid border-black border-2">
        <div className="flex justify-end">
          <span
            className="text-right text-2xl pr-4 pt-1 cursor-pointer"
            onClick={() => onClose()}
          >{`x`}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
