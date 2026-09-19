"use client";

import { create } from "zustand";
import type { ThemeTokens } from "@/providers";

type ThemeEditorState = {
  draft: Partial<ThemeTokens>;
  isDirty: boolean;
  setDraft: (tokens: Partial<ThemeTokens>) => void;
  resetDraft: () => void;
  markSaved: () => void;
};

export const useThemeEditorStore = create<ThemeEditorState>((set) => ({
  draft: {},
  isDirty: false,
  setDraft: (tokens) =>
    set((state) => ({ draft: { ...state.draft, ...tokens }, isDirty: true })),
  resetDraft: () => set({ draft: {}, isDirty: false }),
  markSaved: () => set({ isDirty: false }),
}));