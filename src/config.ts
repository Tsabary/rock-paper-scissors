// ======================
// CANVAS CONFIGURATION
// ======================
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;
export const CANVAS_BACKGROUND = "#0d0d0d";
export const CANVAS_BORDER_RADIUS = 12;

// ======================
// BALL CONFIGURATION
// ======================
export const BALL_RADIUS = 18;
export const BALL_SPEED = 2;
export const BALLS_PER_TYPE = 3; // Number of balls for each type (rock, paper, scissors)
export const MAX_BALLS_PER_TYPE = 10; // Maximum number of balls per type (spawning limit)
export const SPAWN_COOLDOWN_FRAMES = 120; // Frames (2 seconds at 60fps) before a ball can spawn again

// ======================
// BALL COLORS
// ======================
export const BALL_COLORS = {
  rock: "#4ea1ff",     // blue
  paper: "#7dff7d",    // green
  scissors: "#ff5c5c", // red
} as const;

// ======================
// SVG ICON CONFIGURATION
// ======================
export const ICON_FILL_COLOR = "rgba(5, 5, 5, 0.9)"; // White with slight transparency
export const ICON_SCALE = 0.6; // How much of the ball diameter the icon should fill (0.0 - 1.0)

// ViewBox dimensions for each icon type
export const ICON_VIEWBOX = {
  rock: {
    width: 64,
    height: 64,
    offsetX: 0,
    offsetY: 0,
  },
  paper: {
    width: 164,
    height: 164,
    offsetX: -12.5, // Paper SVG has viewBox="-12.5 0 164 164"
    offsetY: 0,
  },
  scissors: {
    width: 206.13,
    height: 206.13,
    offsetX: 0,
    offsetY: 0,
  },
} as const;

// ======================
// WINNER DISPLAY
// ======================
export const WINNER_TEXT_COLOR = "white";
export const WINNER_FONT_SIZE = 24;
export const WINNER_MARGIN_TOP = 20;

// ======================
// WINNER OVERLAY
// ======================
export const OVERLAY_BACKGROUND = "rgba(0, 0, 0, 0.75)";
export const OVERLAY_BLUR = "8px";
export const OVERLAY_TEXT_COLOR = "#ffffff";
export const OVERLAY_TEXT_SIZE = "72px";
export const OVERLAY_TEXT_WEIGHT = "bold";
export const OVERLAY_TEXT_SHADOW = "0 4px 20px rgba(0, 0, 0, 0.5)";
export const OVERLAY_EMOJI_SIZE = "96px";

// ======================
// STATS BAR
// ======================
export const STATS_FONT_SIZE = "18px";
export const STATS_TEXT_COLOR = "#ffffff";
export const STATS_MARGIN_TOP = "16px";
export const STATS_SEPARATOR = "   |   ";
