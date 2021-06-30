import { atom } from 'recoil';

const delayState = atom({
  key: 'delayState',
  default: null
});

export default delayState;