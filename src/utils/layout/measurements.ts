// Simplified measurement utilities - just the basics
export const PAGE = {
  A4: {
    widthPt: 595.28,
    heightPt: 841.89,
  },
  Letter: {
    widthPt: 612,
    heightPt: 792,
  },
} as const;

// That's it! No more complex calculations needed.
// Templates use direct CSS units, browser handles everything. 