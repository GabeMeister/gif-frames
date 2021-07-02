import { atom } from 'recoil';

const frameSizeState = atom({
  key: 'frameSizeState',
  default: {
    height: 0,
    width: 0
  }
});

export default frameSizeState;