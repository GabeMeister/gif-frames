import { atom } from 'recoil';

const frameIndexState = atom({
  key: 'frameIndexState',
  default: 0
});

export default frameIndexState;