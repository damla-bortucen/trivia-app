import { Category } from "@/game/types";

export const colors = {
    // base
    background: "#FFFFFF",
    surface: "#F7F7F5",      // cards - warm off-white
    border: "#E3E3E1",       // dividers - warm gray
    text: "#121212",         // primary text - black 
    textMuted: "#6B6B6B",    // secondary text - gray

    // accent color
    accent: "#F7DA21",       // yellow
    accentText: "#121212",   // text that sits ON the accent

    // difficulty colors
    easy: "#6AAA64",         // green
    medium: "#C9A227",       // amber
    hard: "#C13A32",         // red
};

export const categoryColors = {
    "Entertainment": "#fc716b",
    "General Knowledge": "#b3a7fe",
    "Geography": "#fb9b00",
    "History": "#f7da21",
    "Science and Nature": "#6AAA64",
    "Sports": "#daa8d0",
} as Record<Category, string>;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
};

export const radius = {
    sm: 8,
    md: 12,
    pill: 999,               // rounded buttons
};

export const font = {
    // serif for big display headings (Georgia ships on iOS/Android/web)
    display: "Georgia",
    // system sans for everything else
    sizes: { title: 32, heading: 22, body: 17, caption: 14 },
    weight: { regular: "400", bold: "700" } as const,
};