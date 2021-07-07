import { atom } from 'recoil';

const delayState = atom({
  key: 'delayState',
  default: 10
});

export default delayState;