// data/character_layers.js
window.CHARACTER_LAYERS = {
  layers: [
    {
      name: "bg", mode: "single",
      items: [{ id: "bg", img: "assets/char/layer_background.png", src: "assets/char/layer_background.png" }]
    },
    {
      name: "base", mode: "single",
      items: [{ id: "base-1", img: "assets/char/layer_body.png", src: "assets/char/layer_body.png" }]
    },
    {
      name: "eyes", mode: "single",
      items: [{ id: "eyes-1", img: "assets/char/layer_eyes.png", src: "assets/char/layer_eyes.png" }]
    },
    {
      name: "mouth", mode: "single",
      items: [{ id: "mouth-1", img: "assets/char/layer_mouth.png", src: "assets/char/layer_mouth.png" }]
    },
    {
      name: "accessory", mode: "optional", chance: 1.0,
      items: [{ id: "decor-1", img: "assets/char/layer_decor.png", src: "assets/char/layer_decor.png" }]
    }
  ],
  palettes: {}
};
