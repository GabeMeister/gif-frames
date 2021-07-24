import { atom } from 'recoil';

// A bool that describes whether the user is currently clicking on a text in a frame
const isTextSelectedState = atom({
  key: 'isTextSelectedState',
  default: false
});

export default isTextSelectedState;