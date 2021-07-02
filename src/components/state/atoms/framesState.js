import { atom } from 'recoil';

const framesState = atom({
  key: 'framesState',
  default: [],
  dangerouslyAllowMutability: true
});

export default framesState;