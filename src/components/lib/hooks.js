import { useState, useEffect } from 'react';
import getGiphyGifs from './giphy';

export const useGifSearch = ({ text }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (text.length) {
      setLoading(true);
      setResults([]);

      getGiphyGifs(text)
        .then(gifData => {
          setResults(gifData);
          setLoading(false);
          setError(false);
        })
        .catch(err => {
          setLoading(false);
          setError(true);
        });
    }
    else {
      setResults([]);
      setError(false);
    }
  }, [text]);

  return [results.slice(0, 20), loading, error];
};
