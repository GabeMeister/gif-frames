import { atom } from 'recoil';

const isAutoplayingState = atom({
  key: 'isAutoplayingState',
  default: null
});

export default isAutoplayingState;