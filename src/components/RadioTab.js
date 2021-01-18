import React, { useState } from 'react';

export default function RadioTab({ options }) {
  const [method, setMethod] = useState(options[0].name);

  return (
    <div>
      {options.map(option => {
        return (
          <div className="inline mr-4" key={option.name}>
            <input
              type="radio"
              name="gif_input_method"
              value={option.name}
              className="mr-1 cursor-pointer"
              checked={method === option.name}
              onChange={() => setMethod(option.name)}
            />
            <label
              htmlFor="gif_input_method"
              onClick={() => setMethod(option.name)}
              className="cursor-pointer"
            >{option.displayName}</label>
          </div>
        );
      })}
      <div className="mt-3">
        {options.find(x => x.name === method).content}
      </div>
    </div >
  );
};
