import { useEffect, useState, useRef } from 'react';
import useInterval from './useInterval';

export default function useCountdownTimer({ millisecondsPerStep, startingNumber, onFinish }) {
  const onFinishRef = useRef();
  const [number, setNumber] = useState(startingNumber);
  const { start, stop } = useInterval(() => {
    if (number === 0) {
      stop();
      onFinishRef.current && onFinishRef.current();
    }
    else {
      setNumber(number - 1);
    }
  }, millisecondsPerStep);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  return {
    start,
    restart: () => {
      setNumber(startingNumber);
      start();
    },
    stop,
    number
  };
}