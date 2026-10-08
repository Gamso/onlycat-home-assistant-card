import "./components/onlycat-home-assistant-card";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "onlycat-home-assistant-card",
  name: "OnlyCat Home Assistant Card",
  description: "Card to monitor and control your OnlyCat smart cat flap.",
  preview: true,
  documentationURL: "https://github.com/Gamso/onlycat-home-assistant-card",
});
