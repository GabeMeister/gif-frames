import { atom } from 'recoil';

const frameIndexState = atom({
  key: 'frameIndexState',
  default: -1
});

export default frameIndexState;