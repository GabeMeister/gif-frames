import { atom } from 'recoil';

const selectedTextIdState = atom({
  key: 'selectedTextIdState',
  default: null
});

export default selectedTextIdState;