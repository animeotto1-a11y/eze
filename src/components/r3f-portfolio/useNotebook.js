import { create } from 'zustand';

export const useNotebook = create((set) => ({
  isOpen: true,
  isPoweredOn: true,
  isFinishedBooting: true,
  loadedPage: 'gallery',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  powerOn: () => set({ isPoweredOn: true }),
  powerOff: () => set({ isPoweredOn: false, isFinishedBooting: false }),
  finishBooting: () => set({ isFinishedBooting: true }),
  switchPage: (page) => set({ loadedPage: page }),
}));

export default useNotebook;
