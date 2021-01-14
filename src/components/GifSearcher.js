import React, { useRef, useState } from 'react';

import { useGifSearch } from './lib/hooks';

export default function GifSearcher() {
  const searchWordRef = useRef(null);
  const [hoveredGifId, setHoveredGifId] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [gifs, gifsLoading, gifsError] = useGifSearch({ text: searchWord });

  return (
    <div>
      <input
        ref={searchWordRef}
        type="text"
        value={searchWord}
        onChange={() => setSearchWord(searchWordRef.current.value)}
        placeholder="Search for a gif..."
        className="pb-2 border-b-2 outline-none focus:border-blue-300 mr-3 w-1/3"
      />
      <div>
        {gifsLoading && (
          <div>Loading...</div>
        )}
        {gifsError && (
          <div>Error occurred while loading gifs...</div>
        )}
        {gifs && (
          gifs.map(gif => (
            <img
              key={gif.id}
              alt="gif_thumbnail_preview"
              src={hoveredGifId === gif.id ? gif.url : gif.thumbnail}
              onMouseEnter={() => setHoveredGifId(gif.id)}
              onMouseLeave={() => setHoveredGifId('')}
              className="m-3 w-48 inline-block"
            />
          ))
        )}

      </div>
    </div >
  );
};
