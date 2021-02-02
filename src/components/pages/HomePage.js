import React, { useRef, useState } from 'react';
import {
  Redirect
} from 'react-router-dom';
import GifSearcher from '../GifSearcher';
import GifUploader from '../GifUploader';
import RadioTab from '../RadioTab';

export default function HomePage() {
  const [gifUrl, setGifUrl] = useState('');

  const [redirecting, setRedirecting] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(false);
  const gifUrlRef = useRef(null);

  /*
   * DEBUGGING PURPOSES
   */
  // http://localhost:3000/editor?gifUrl=https://media.giphy.com/media/3o7aD0ILhi08LGF1PG/giphy.gif

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

  function onGifUploaded(file) {
    setGifUrl(URL.createObjectURL(file));
    setRedirecting(true);
  }

  return (
    <>
      {redirecting ? (
        <Redirect to={`/editor?gifUrl=${gifUrl}`} />
      ) : (
          <div className="p-6 w-2/3 mr-auto ml-auto text-center">
            <h1 className="text-8xl mt-3 mb-10 headline">Text Gif</h1>
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
                      className="pb-2 border-b-2 outline-none focus:border-blue-300 mx-auto w-1/3"
                    />{' '}
                    <button
                      onClick={onUrlEntered}
                      className={`${fetchLoading ? 'disabled:opacity-50 bg-gray-300' : 'bg-blue-300'} ml-3 p-2.5 rounded`}
                    >
                      {fetchLoading
                        ? <span>Loading <img alt="loading-spinner" className="inline h-3" src="spinner.gif" /></span>
                        : <span>Go</span>
                      }
                    </button>
                  </>
                )
              },
              {
                name: 'file',
                displayName: 'File',
                content: (
                  <GifUploader onGifUploaded={file => onGifUploaded(file)} />
                )
              }
            ]} />
          </div>
        )}
    </>
  );
}
