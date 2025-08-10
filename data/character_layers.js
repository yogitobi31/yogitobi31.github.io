// data/character_layers.js
// 희귀도 + 테마 태그 기반 선택을 지원하는 데이터 스키마
// - 지금은 기존 placeholder PNG로도 작동하도록 경로를 맞춰둠
// - 나중에 bg_* / border_* 이미지를 올리면 자동으로 반영됨

window.CHARACTER_LAYERS = {
  // 희귀도 가중치 (합=1.0) — 필요시 조정
  rarityWeights: { UR: 0.05, SR: 0.15, R: 0.30, C: 0.50 },

  // 레이어는 위에서 아래 순서대로 캔버스에 합성됨
  layers: [
    // 0) 희귀도 배경 (지금은 placeholder로 동일 이미지 사용)
    {
      name: "bg",
      mode: "single",
      items: [
        // 나중에 실제 파일이 생기면 각각 올려서 경로만 바꾸면 됨
        { id:"bg-C",  rarity:"C",  img:"assets/char/layer_background.png", tags:["any"] },
        { id:"bg-R",  rarity:"R",  img:"assets/char/layer_background.png", tags:["any"] },
        { id:"bg-SR", rarity:"SR", img:"assets/char/layer_background.png", tags:["any"] },
        { id:"bg-UR", rarity:"UR", img:"assets/char/layer_background.png", tags:["any"] }
        // 예: 준비되면 아래처럼 교체
        // { id:"bg-C",  rarity:"C",  img:"assets/char/bg/bg_common.png", tags:["any"] },
        // { id:"bg-R",  rarity:"R",  img:"assets/char/bg/bg_rare.png",   tags:["any"] },
        // { id:"bg-SR", rarity:"SR", img:"assets/char/bg/bg_sr.png",     tags:["any"] },
        // { id:"bg-UR", rarity:"UR", img:"assets/char/bg/bg_ur.png",     tags:["any"] }
      ]
    },

    // 1) 본체(테마 공용 — 나중에 테마별 파일로 세분화 가능)
    {
      name: "base",
      mode: "single",
      items: [
        { id:"base-1", img:"assets/char/layer_body.png", tags:["any"] }
      ]
    },

    // 2) 눈 (테마별 미묘한 선택 가능)
    {
      name: "eyes",
      mode: "single",
      items: [
        { id:"eyes-happy", img:"assets/char/layer_eyes.png", tags:["wind","earth","star","any"] },
        { id:"eyes-smile", img:"assets/char/layer_eyes.png", tags:["fire","water","any"] }
      ]
    },

    // 3) 입
    {
      name: "mouth",
      mode: "single",
      items: [
        { id:"mouth-smile", img:"assets/char/layer_mouth.png", tags:["wind","earth","star","any"] },
        { id:"mouth-u",     img:"assets/char/layer_mouth.png", tags:["fire","water","any"] }
      ]
    },

    // 4) 악세서리 (확률 등장)
    {
      name: "accessory",
      mode: "optional",
      chance: 0.85, // 85% 확률로 표시
      items: [
        { id:"acc-feather", img:"assets/char/layer_decor.png", tags:["wind","star","any"] },
        { id:"acc-flame",   img:"assets/char/layer_decor.png", tags:["fire","any"] },
        { id:"acc-leaf",    img:"assets/char/layer_decor.png", tags:["earth","any"] },
        { id:"acc-drop",    img:"assets/char/layer_decor.png", tags:["water","any"] }
      ]
    },

    // 5) 희귀도 테두리 (마지막에 씌움 / 지금은 placeholder 없으니 optional)
    {
      name: "border",
      mode: "optional",
      chance: 1.0, // 희귀도 연출을 항상 시도
      items: [
        // 지금은 경로가 placeholder가 없어서 404가 나도 렌더는 계속 진행됨
        { id:"border-C",  rarity:"C",  img:"assets/char/border/border_common.png", tags:["any"] },
        { id:"border-R",  rarity:"R",  img:"assets/char/border/border_rare.png",   tags:["any"] },
        { id:"border-SR", rarity:"SR", img:"assets/char/border/border_sr.png",     tags:["any"] },
        { id:"border-UR", rarity:"UR", img:"assets/char/border/border_ur.png",     tags:["any"] }
      ]
    }
  ]
};
