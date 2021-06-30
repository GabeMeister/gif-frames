import { atom } from 'recoil';

const isRendering = atom({
  key: 'isRendering',
  default: null
});

export default isRendering;