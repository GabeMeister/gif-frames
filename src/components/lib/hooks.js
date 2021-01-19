import { useState, useEffect, useCallback } from 'react';
import getGiphyGifs from './giphy';
import debounce from 'debounce';

export const useGifSearch = ({ text }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchGifs = useCallback(debounce(text => {
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
  }, 200), []);

  useEffect(() => {
    if (text.length) {
      setLoading(true);
      setResults([]);

      fetchGifs(text);
    }
    else {
      setResults([]);
      setError(false);
    }
  }, [text, fetchGifs]);

  return [results.slice(0, 20), loading, error];
};
