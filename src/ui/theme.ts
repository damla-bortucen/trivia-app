import { Appearance, useColorScheme } from "react-native";
import { AppearanceChoice } from "@/game/types";

const light = {
    // base
    background: "#FFFFFF",
    surface: "#F7F7F5",      // cards - warm off-white
    border: "#E3E3E1",       // dividers - warm gray
    text: "#121212",         // primary text - black
    textMuted: "#6B6B6B",    // secondary text - gray
    textDarkMuted: "#454545", // secondary text headers - dark gray

    // accent color
    accent: "#F7DA21",       // yellow
    accentText: "#121212",   // text that sits ON the accent

    // pack colours are pastels in both themes, so text on them stays dark
    onPack: "#121212",

    // marking an answer - used as text and borders on the card surface, so
    // darker than the difficulty colours to stay readable (4.5:1+)
    correct: "#3D7A38",
    wrong: "#B3352E",
    correctFill: "#EAF4E8",  // a tint of the border behind the Correct pill
    wrongFill: "#F8E1DF",

    // difficulty colors
    easy: "#6AAA64",         // green
    medium: "#C9A227",       // amber
    hard: "#C13A32",         // red
};

export type Colors = typeof light;

// same keys as light - difficulty colours carry over unchanged
const dark: Colors = {
    ...light,
    accent: "#CDB42A",       // muted yellow - full brightness glares on near-black
    background: "#121212",
    surface: "#1E1E1E",      // cards - lifted off the background
    border: "#3A3A3C",
    text: "#F2F2F2",
    textMuted: "#A0A0A0",
    textDarkMuted: "#C7C7C7", // headers sit a step brighter than muted
    correct: "#7CC275",      // lifted so they read on the dark surface
    wrong: "#F07067",
    correctFill: "#22331F",  // dark tints - a light fill would glare here
    wrongFill: "#3A2220",
};

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

// shared text styles - screens use these rather than redefining them, so a
// heading looks the same wherever it appears
function makeText(colors: Colors) {
    return {
        title: {
            fontFamily: font.display,
            fontSize: font.sizes.title,
            color: colors.text,
        },
        heading: {
            fontFamily: font.display,
            fontSize: font.sizes.heading,
            color: colors.text,
        },
        body: {
            fontSize: font.sizes.body,
            color: colors.text,
        },
        // small text - label is secondary, caption is full strength
        label: {
            fontSize: font.sizes.caption,
            color: colors.textMuted,
        },
        caption: {
            fontSize: font.sizes.caption,
            color: colors.text,
        },
    };
}

// built once at load so each scheme hands back the same objects every render
const themes = {
    light: { colors: light, text: makeText(light) },
    dark: { colors: dark, text: makeText(dark) },
};

export type Theme = typeof themes.light;

// follows the phone's appearance setting and re-renders when it changes
export function useTheme(): Theme {
    return useColorScheme() === "dark" ? themes.dark : themes.light;
}

// overrides the scheme app-wide - useColorScheme, alerts, the keyboard and
// the status bar all follow. "unspecified" hands control back to the phone
export function applyAppearance(choice: AppearanceChoice) {
    Appearance.setColorScheme(choice === "system" ? "unspecified" : choice);
}
