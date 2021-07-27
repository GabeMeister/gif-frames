import { useCallback, useEffect, useRef, useState } from 'react';

export default function useInterval(callback, delay) {
  const callbackRef = useRef();
  const intervalRef = useRef();
  const [initialRender, setInitialRender] = useState(false);

  // update callback function with current render callback that has access to latest props and state
  useEffect(() => {
    callbackRef.current = callback;
  });

  const callFunction = useCallback(() => {
    // Force the user to call start() first to actually trigger the interval
    if(!initialRender) {
      setInitialRender(true);
      return;
    }
    
    if (!delay) {
      return () => {};
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);

    return () => clearInterval(intervalRef.current);
  }, [delay, initialRender]);

  useEffect(callFunction, [delay]);

  return {
    stop: () => {
      clearInterval(intervalRef.current);
    },
    start: callFunction
  };
}