import "./components/onlycat-home-assistant-card";

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "onlycat-home-assistant-card",
  name: "OnlyCat Home Assistant Card",
  description: "Card to monitor and control your OnlyCat smart cat flap.",
  preview: true,
  documentationURL: "https://github.com/OnlyCatAI/onlycat-home-assistant",
});
