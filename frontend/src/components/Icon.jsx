import React from "react";

// Universal emoji mapping
const emojiMap = {
  home: "🏠",
  "chart-bar": "📊",
  "user-group": "👥",
  plus: "➕",
  cog: "⚙️",
  chat: "💬",
  shield: "🛡️",
  info: "ℹ️",
  logout: "🚪",
  user: "👤",
  menu: "☰",
  close: "❌",
  check: "✅",
  search: "🔍",

  mail: "✉️",
  envelope: "✉️",
  lock: "🔒",
  eye: "👁️",

  sun: "☀️",
  moon: "🌙",
  sparkles: "✨",
  heart: "❤️",
  "building-office": "🏢",
  radio: "📻",
  "cpu-chip": "💻",
  gift: "🎁",
  "face-smile": "😊",
  "paint-brush": "🎨",
  "pencil-square": "✏️",
  cloud: "☁️",
  print: "🖨️",
  trash: "🗑️",
  music: "🎵",
  bolt: "⚡",
  flower: "🌸",
  unicorn: "🦄",
  vampire: "🧛",
  tree: "🌳",
  waves: "🌊",
  water: "💧",
  lemon: "🍋",
  coffee: "☕",
  mountain: "⛰️",
  snowflake: "❄️",
  gem: "💎",
};

// --------------------------------------------
// Icon component
// --------------------------------------------
const Icon = ({ name, className = "w-5 h-5 text-lg", ...props }) => {
  const emoji = emojiMap[name] || "✏️"; // default if not found
  return (
    <span className={className} {...props}>
      {emoji}
    </span>
  );
};

export default Icon;

// Export all available icon names
export const iconNames = Object.keys(emojiMap);

// Check if icon exists
export const hasIcon = (name) => emojiMap.hasOwnProperty(name);
