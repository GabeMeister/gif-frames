import React, { useEffect, useRef, useState } from 'react';
import {
  Redirect
} from 'react-router-dom';
import GifSearcher from '../GifSearcher';
import RadioTab from '../RadioTab';

export default function HomePage() {
  const [gifUrl, setGifUrl] = useState('');

  const [redirecting, setRedirecting] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);
  const gifUrlRef = useRef(null);

  /*
   * DEBUGGING PURPOSES
   */
  useEffect(() => {
    // // short wipe-out gif (5 frames)
    // setGifUrl('https://media.giphy.com/media/3o7aD0ILhi08LGF1PG/giphy.gif');

    // // long wipe-out gif (66 frames)
    // setGifUrl('https://media.giphy.com/media/qhoABJOROS9kQ/giphy.gif');
  }, []);

  function onUrlEntered() {
    setFetchLoading(true);
    setTimeout(() => {
      if (gifUrl.endsWith('.gif')) {
        setRedirecting(true);
      }

      setFetchLoading(false);
    }, 300);
  }

  function onSearchComplete(url) {
    setGifUrl(url);
    setRedirecting(true);
  }

  return (
    <>
      {redirecting ? (
        <Redirect to={`/editor?gifUrl=${gifUrl}`} />
      ) : (
          <div className="p-6 w-1/2 mr-auto ml-auto">
            <RadioTab options={[
              {
                name: 'search',
                displayName: 'Search',
                content: (
                  <GifSearcher onGifSelected={url => onSearchComplete(url)} />
                )
              },
              {
                name: 'url',
                displayName: 'Url',
                content: (
                  <>
                    <input
                      ref={gifUrlRef}
                      type="text"
                      value={gifUrl}
                      onChange={() => setGifUrl(gifUrlRef.current.value)}
                      className="pb-2 border-b-2 outline-none focus:border-blue-300 mr-3 w-1/3"
                    />{' '}
                    <button
                      onClick={onUrlEntered}
                      className={`${fetchLoading ? 'disabled:opacity-50 bg-gray-300' : 'bg-blue-300'} p-2.5 rounded`}
                    >
                      {fetchLoading
                        ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
                        : <span>Go</span>
                      }
                    </button>
                  </>
                )
              }
            ]} />
          </div>
        )}
    </>
  );
}
