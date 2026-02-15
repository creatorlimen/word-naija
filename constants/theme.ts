/**
 * Word Naija - Theme Constants (v2.1 - Polished Wood & Gold)
 * Closely matching Wordscapes visual style.
 */

export const colors = {
  // Main Screen Background (Deep Forest Green)
  background: "#1E5128", 
  backgroundDark: "#0B2B12",

  // Game Board Frame
  boardBackground: "#6D2323", // The reddish-brown mat
  boardBorder: "#8B4513",     // Saddle brown outer frame
  boardShadow: "#3E1414",

  // 3D Tiles (The Letters)
  tile: {
    background: "#FDF5E6",    // OldLace / Cream
    backgroundSelected: "#FFB300", // Vivid Orange/Gold for selection
    borderBottom: "#C0A080",  // Tan/darker cream for 3D effect of unselected
    borderBottomSelected: "#E65100", // Dark orange for 3D effect of selected
    text: "#5D4037",          // Dark brown wood text
    textSelected: "#FFFFFF",  // White text when selected
    empty: "#4E342E",         // Dark slot on board
    emptyShadow: "#3E2723",   // Inner shadow for empty slot
    // Legacy support
    border: "#D7CCC8",
    shadow: "#C0A080",
  },

  // Header & UI Pills
  pill: {
    background: "#2E7D32",    // Forest Green (like reference buttons)
    border: "#FFD54F",        // Gold rim
    text: "#FFFFFF",
    icon: "#FFD54F",          // Gold icon
    shadow: "#1B5E20",        // Dark green shadow
  },
  
  // Footer Circular Buttons
  button: {
    primary: "#4CAF50",       // Standard Green
    secondary: "#0277BD",     // Blue
    function: "#66BB6A",      // Lighter green for footer buttons
    functionShadow: "#388E3C",// Darker green 3D edge
    gold: "#FFC107",          // Gold/Yellow
    text: "#FFFFFF"
  },

  // Text Colors
  foreground: "#FFFFFF",
  foregroundDark: "#3E2723",
  muted: "#BCAAA4",
  mutedDark: "#5D4037", 
  
  // State colors
  overlay: "rgba(0,0,0,0.6)",
  error: "#D32F2F",
  success: "#4CAF50",
  warning: "#FFA000",
  
  // Base for standard borders
  border: "#8B4513",

  // Legacy mappings for existing components not yet migrated
  primary: "#6D2323",
  secondary: "#FFD54F",
  accent: "#388E3C",
  card: "#FEF9E7",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  title: 40,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 10, // Reduced radius for "Squaricle" tile look
  full: 9999,
  round: 9999,
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  tile3D: {
    // We will handle 3D via borderBottomWidth, but add subtle drop shadow too
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  }
};
