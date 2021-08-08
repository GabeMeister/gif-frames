import React, { useRef, useState } from 'react';

import { useGifSearch } from './lib/hooks';

export default function GifSearcher({ onGifSelected }) {
  const searchWordRef = useRef(null);
  const [hoveredGifId, setHoveredGifId] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [gifs, gifsLoading, gifsError] = useGifSearch({ text: searchWord });
  const [selectedGif, setSelectedGif] = useState(null);

  return (
    <div>
      <div>
        <input
          ref={searchWordRef}
          type="text"
          value={searchWord}
          onChange={() => setSearchWord(searchWordRef.current.value)}
          placeholder="Search for a gif..."
          className="mx-auto pb-2 border-b-2 outline-none focus:border-blue-300 w-1/2"
        />
        <button className={`${selectedGif !== null ? '' : 'invisible'} ml-3 p-2 rounded bg-green-400`} onClick={() => onGifSelected(selectedGif.url)}>Next →</button>
      </div>
      {gifsLoading && (
        <div className="text-center	mt-3">Loading...</div>
      )}
      {gifsError && (
        <div>Error occurred while loading gifs...</div>
      )}
      {!!gifs.length && (
        <div className="mt-3 text-center p-3 overflow-scroll border-solid border rounded rounded-sm border-gray-300" style={{ height: '650px' }}>
          {
            gifs.map(gif => (
              <img
                key={gif.id}
                alt="gif_thumbnail_preview"
                src={(hoveredGifId === gif.id) || (selectedGif !== null && selectedGif.id === gif.id) ? gif.url : gif.thumbnail}
                onMouseEnter={() => setHoveredGifId(gif.id)}
                onMouseLeave={() => setHoveredGifId('')}
                className={`m-3 w-48 inline-block cursor-pointer ${selectedGif !== null && gif.id === selectedGif.id ? 'border-green-400 border-solid border-8 rounded' : ''}`}
                onClick={() => {
                  setSelectedGif(gif);
                }}
              />
            ))
          }
        </div>
      )}
    </div >
  );
};
