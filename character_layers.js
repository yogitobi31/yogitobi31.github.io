// data/character_layers.js
// 앱이 레이어 정보를 읽을 수 있게 전역에 올립니다.
window.CHARACTER_LAYERS = {
  // 캐릭터를 구성하는 레이어들 (위에서부터 순서대로 캔버스에 그려짐)
  layers: [
    {
      name: "bg",              // 배경 (단색 PNG 추천: 900x900)
      mode: "single",
      items: [
        { id: "bg-wind",  img: "assets/char/bg/bg-wind.png"  },
        { id: "bg-fire",  img: "assets/char/bg/bg-fire.png"  },
        { id: "bg-earth", img: "assets/char/bg/bg-earth.png" },
        { id: "bg-water", img: "assets/char/bg/bg-water.png" },
        { id: "bg-star",  img: "assets/char/bg/bg-star.png"  }
      ]
    },
    {
      name: "base",            // 몸통/기본형 (테마 공용)
      mode: "single",
      items: [
        { id: "base-1", img: "assets/char/base/base-1.png" },   // 둥근 기본 바디
        { id: "base-2", img: "assets/char/base/base-2.png" }    // 살짝 다른 형태 (선택사항)
      ]
    },
    {
      name: "eyes",            // 눈
      mode: "single",
      items: [
        { id: "eyes-happy", img: "assets/char/eyes/eyes-happy.png" },
        { id: "eyes-smile", img: "assets/char/eyes/eyes-smile.png" }
      ]
    },
    {
      name: "mouth",           // 입
      mode: "single",
      items: [
        { id: "mouth-smile", img: "assets/char/mouth/mouth-smile.png" },
        { id: "mouth-u",     img: "assets/char/mouth/mouth-u.png" }
      ]
    },
    {
      name: "accessory",       // 장식(선택)
      mode: "optional",        // optional + chance 로 랜덤 등장
      chance: 0.6,             // 60% 확률로 등장
      items: [
        { id: "acc-feather", img: "assets/char/acc/acc-feather.png" },
        { id: "acc-star",    img: "assets/char/acc/acc-star.png" }
      ]
    }
  ],

  // 테마 팔레트(필요시 app_result.js가 이름/설명 톤이나 배경 선택에 사용할 수 있음)
  palettes: {
    wind:  { primary: "#7cc6ff", secondary: "#e6f7ff", accent: "#5aa7ff" },
    fire:  { primary: "#ff8a5b", secondary: "#fff0e6", accent: "#ff6a3d" },
    earth: { primary: "#9ec27b", secondary: "#f4ffe6", accent: "#7aad57" },
    water: { primary: "#6ec9d8", secondary: "#e6fbff", accent: "#47b4c7" },
    star:  { primary: "#b49bff", secondary: "#f3efff", accent: "#9a7cff" }
  }
};
