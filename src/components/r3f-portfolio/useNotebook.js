import { create } from 'zustand';

export const useNotebook = create((set) => ({
  isOpen: false,
  isPoweredOn: false,
  isFinishedBooting: false,
  isNewVisit: true,
  loadedPage: 'gallery',

  changeVisitStatus: () => set({ isNewVisit: false }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  powerOn: () => set({ isPoweredOn: true }),
  powerOff: () => set({ isPoweredOn: false, isFinishedBooting: false }),
  finishBooting: () => set({ isFinishedBooting: true }),
  switchPage: (page) => set({ loadedPage: page }),
}));

export default useNotebook;
