import { atom } from 'recoil';

const selectedTextIndexState = atom({
  key: 'selectedTextIndexState',
  default: -1
});

export default selectedTextIndexState;