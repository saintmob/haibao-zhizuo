export function initPosterEditor() {
const templates = [
  {
    id: "editorial",
    name: "Shashin Margin",
    note: "写真留白、生活方式海报",
  },
  {
    id: "gallery",
    name: "Muji Note",
    note: "无印感、细线网格、清爽信息",
  },
  {
    id: "index",
    name: "Kissa Menu",
    note: "喫茶店菜单、小字密排",
  },
  {
    id: "split",
    name: "Ticket Stub",
    note: "车票票据、活动入场券",
  },
  {
    id: "cover",
    name: "Tategaki",
    note: "竖排标题、书腰与短句",
  },
  {
    id: "modern",
    name: "City Pop Grid",
    note: "平成复古、轻快几何色块",
  },
  {
    id: "archive",
    name: "Zine Collage",
    note: "手作拼贴、独立小刊",
  },
  {
    id: "neo",
    name: "Neo Grid",
    note: "现代网格、品牌视觉",
  },
  {
    id: "typewave",
    name: "Type Wave",
    note: "大字波形、音乐活动",
  },
  {
    id: "minimaltech",
    name: "Minimal Tech",
    note: "科技发布、极简信息",
  },
  {
    id: "maximal",
    name: "Maximal Pop",
    note: "强视觉、潮流拼色",
  },
];

const palettes = [
  { paper: "#fbf7ed", ink: "#2c2b27", tone: "#9cc8c2", accent: "#e86f5b" },
  { paper: "#f8f3f0", ink: "#33302c", tone: "#e8b7c8", accent: "#7fa5c8" },
  { paper: "#f5f0df", ink: "#273029", tone: "#b7c99c", accent: "#e3a545" },
  { paper: "#f7f7f2", ink: "#222426", tone: "#c8d7e8", accent: "#ef7b72" },
  { paper: "#f2f6f3", ink: "#172326", tone: "#85d6cd", accent: "#ff6b4a" },
  { paper: "#fff9e8", ink: "#28231e", tone: "#f4c95d", accent: "#2b6f9f" },
  { paper: "#f5f1ff", ink: "#252238", tone: "#b9a7ff", accent: "#ff7aa8" },
  { paper: "#f4f5ef", ink: "#1c1f1a", tone: "#d6e36c", accent: "#111111" },
  { paper: "#eef3ff", ink: "#1a2435", tone: "#96b7ff", accent: "#ff814f" },
  { paper: "#fff4ef", ink: "#30231f", tone: "#ffb199", accent: "#4d8b77" },
];

const backgrounds = [
  {
    id: "amber",
    name: "Milk Tea",
    image:
      "radial-gradient(circle at 22% 18%, rgba(255,255,255,.85) 0 10%, transparent 11%), linear-gradient(145deg, #fbf6ea 0%, #ead9bd 46%, #d7bfa2 100%)",
  },
  {
    id: "mono",
    name: "Window Light",
    image:
      "linear-gradient(90deg, rgba(255,255,255,.72) 0 28%, transparent 28%), linear-gradient(155deg, #f6f3ea, #d9e3df 52%, #b6c8c0)",
  },
  {
    id: "cyan",
    name: "Soda Blue",
    image:
      "radial-gradient(circle at 72% 30%, rgba(255,255,255,.8) 0 7%, transparent 8%), linear-gradient(135deg, #eef8f6, #a8d7df 48%, #6ea7be)",
  },
  {
    id: "rose",
    name: "Sakura Paper",
    image:
      "radial-gradient(circle at 72% 24%, rgba(255,255,255,.7) 0 12%, transparent 13%), linear-gradient(155deg, #fff6f5, #edc8cf 55%, #d9a7b4)",
  },
  {
    id: "green",
    name: "Matcha",
    image:
      "repeating-linear-gradient(90deg, rgba(255,255,255,.28) 0 1px, transparent 1px 22px), linear-gradient(130deg, #f4f1df, #cad8a5 48%, #9fb67d)",
  },
  {
    id: "blue",
    name: "Evening Train",
    image:
      "linear-gradient(180deg, rgba(255,255,255,.76) 0 18%, transparent 18%), linear-gradient(160deg, #f2f4f1, #c8d5e6 48%, #89a7c9)",
  },
];

const fontModules = [
  { id: "didot", name: "日杂衬线" },
  { id: "grotesk", name: "窄体刊头" },
  { id: "song", name: "明朝书感" },
  { id: "minimal", name: "无印轻体" },
  { id: "brutal", name: "平成粗圆" },
  { id: "noto-sans", name: "Noto Sans 开源" },
  { id: "noto-serif", name: "Noto Serif 开源" },
  { id: "zen-maru", name: "Zen Maru 圆体" },
  { id: "m-plus", name: "M PLUS 日文" },
  { id: "roboto-condensed", name: "Roboto 窄体" },
];

const poster = document.querySelector("#posterCanvas");
const templateList = document.querySelector("#templateList");
const paletteControl = document.querySelector("#paletteControl");
const ratioControl = document.querySelector("#ratioControl");
const backgroundControl = document.querySelector("#backgroundControl");
const fontControl = document.querySelector("#fontControl");
const layerList = document.querySelector("#layerList");
const activeLayerName = document.querySelector("#activeLayerName");
const activeTemplateName = document.querySelector("#activeTemplateName");
const templateCount = document.querySelector("#templateCount");
const colorControls = {
  paper: document.querySelector("#paperColorInput"),
  ink: document.querySelector("#inkColorInput"),
  tone: document.querySelector("#toneColorInput"),
  accent: document.querySelector("#accentColorInput"),
};
const sizeControls = {
  width: document.querySelector("#customWidthInput"),
  height: document.querySelector("#customHeightInput"),
};
const motionControls = {
  toggle: document.querySelector("#motionToggle"),
  speed: document.querySelector("#motionSpeedInput"),
  modes: document.querySelector("#motionModeControl"),
  asset: document.querySelector("#motionAssetInput"),
};

const fields = {
  kicker: [document.querySelector("#kickerInput"), document.querySelector("#posterKicker")],
  title: [document.querySelector("#titleInput"), document.querySelector("#posterTitle")],
  subtitle: [document.querySelector("#subtitleInput"), document.querySelector("#posterSubtitle")],
  date: [document.querySelector("#dateInput"), document.querySelector("#posterDate")],
  place: [document.querySelector("#placeInput"), document.querySelector("#posterPlace")],
};

let layers = [
  { id: "title", name: "标题", z: 12 },
  { id: "kicker", name: "眉标", z: 11 },
  { id: "subtitle", name: "副标题", z: 11 },
  { id: "meta", name: "日期地点", z: 11 },
  { id: "shapeCircle", name: "矢量圆形", z: 8 },
  { id: "shapeRect", name: "矢量矩形", z: 7 },
  { id: "shapeLine", name: "矢量线条", z: 9 },
  { id: "art", name: "装饰图形", z: 4 },
  { id: "grain", name: "纸纹质感", z: 18 },
  { id: "bg", name: "底图", z: 0 },
];

const layerControls = {
  visible: document.querySelector("#layerVisibleInput"),
  x: document.querySelector("#layerXInput"),
  y: document.querySelector("#layerYInput"),
  scale: document.querySelector("#layerScaleInput"),
  rotate: document.querySelector("#layerRotateInput"),
  opacity: document.querySelector("#layerOpacityInput"),
  z: document.querySelector("#layerZInput"),
};
const layerElements = {};
let cachedExportCss = "";
let dragState = null;
let layerFrame = 0;
let customLayerCount = 0;
let currentMotionMode = "float";

let currentTemplate = templates[0].id;
let currentPalette = 0;
let currentBackground = backgrounds[0].id;
let currentFont = fontModules[0].id;
let activeLayer = "title";
let currentSize = { width: 1080, height: 1350, mode: "portrait" };
let history = [];
let future = [];
let isRestoring = false;
const layerState = Object.fromEntries(
  layers.map((layer) => [
    layer.id,
    { x: 0, y: 0, scale: 100, rotate: 0, opacity: 100, z: layer.z, visible: true },
  ]),
);

function snapshotState() {
  return {
    currentTemplate,
    currentPalette,
    currentBackground,
    currentFont,
    activeLayer,
    currentSize: { ...currentSize },
    layerOrder: layers.map((layer) => layer.id),
    layerState: JSON.parse(JSON.stringify(layerState)),
    colors: {
      paper: colorControls.paper.value,
      ink: colorControls.ink.value,
      tone: colorControls.tone.value,
      accent: colorControls.accent.value,
    },
    bgImage: poster.style.getPropertyValue("--bg-image"),
    customFontFamily: document.documentElement.style.getPropertyValue("--custom-font-family"),
    content: Object.fromEntries(Object.entries(fields).map(([key, [input]]) => [key, input.value])),
  };
}

function pushHistory() {
  if (isRestoring) return;
  history.push(snapshotState());
  if (history.length > 80) history.shift();
  future = [];
}

function restoreState(snapshot) {
  if (!snapshot) return;
  isRestoring = true;
  currentTemplate = snapshot.currentTemplate;
  currentPalette = snapshot.currentPalette;
  currentBackground = snapshot.currentBackground;
  currentFont = snapshot.currentFont;
  activeLayer = snapshot.activeLayer;
  currentSize = { ...snapshot.currentSize };
  layers
    .filter((layer) => !snapshot.layerOrder.includes(layer.id))
    .forEach((layer) => {
      getLayerElement(layer.id)?.remove();
      delete layerElements[layer.id];
      delete layerState[layer.id];
    });
  layers = snapshot.layerOrder.map((id) => layers.find((layer) => layer.id === id)).filter(Boolean);
  Object.entries(snapshot.layerState).forEach(([id, state]) => Object.assign(layerState[id], state));
  Object.entries(snapshot.content).forEach(([key, value]) => {
    const pair = fields[key];
    if (!pair) return;
    pair[0].value = value;
    pair[1].textContent = value;
  });
  applyTemplate(currentTemplate);
  applyPalette(currentPalette);
  if (currentBackground === "custom") {
    poster.style.setProperty("--bg-image", snapshot.bgImage);
  } else {
    applyBackground(currentBackground);
  }
  applyFont(currentFont);
  if (currentFont === "custom") {
    document.documentElement.style.setProperty("--custom-font-family", snapshot.customFontFamily);
    poster.classList.add("font-custom");
  }
  applyCustomSize(currentSize.width, currentSize.height, currentSize.mode);
  Object.entries(snapshot.colors).forEach(([key, value]) => {
    colorControls[key].value = value;
    document.documentElement.style.setProperty(`--${key}`, value);
  });
  applyAllLayerStyles();
  renderLayers();
  syncLayerControls();
  isRestoring = false;
}

function undo() {
  if (!history.length) return;
  future.push(snapshotState());
  restoreState(history.pop());
}

function redo() {
  if (!future.length) return;
  history.push(snapshotState());
  restoreState(future.pop());
}

function renderTemplates() {
  templateCount.textContent = `${templates.length} 款`;
  templateList.innerHTML = templates
    .map(
      (template) => `
        <button class="template-card ${template.id === currentTemplate ? "active" : ""}" data-template="${template.id}">
          <span class="thumb ${template.id}"></span>
          <span>
            <strong>${template.name}</strong>
            <span>${template.note}</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderBackgrounds() {
  backgroundControl.innerHTML = backgrounds
    .map(
      (background) => `
        <button
          class="background-card ${background.id === currentBackground ? "active" : ""}"
          data-background="${background.id}"
          style="--preview:${background.image}"
          title="${background.name}"
        ></button>
      `,
    )
    .join("");
}

function renderFonts() {
  fontControl.innerHTML = fontModules
    .map(
      (font) => `
        <button class="font-card ${font.id === currentFont ? "active" : ""}" data-font="${font.id}">
          ${font.name}
        </button>
      `,
    )
    .join("");
}

function renderLayers() {
  layerList.innerHTML = layers
    .map((layer) => {
      const state = layerState[layer.id];
      return `
        <button class="layer-item ${layer.id === activeLayer ? "active" : ""}" data-select-layer="${layer.id}" draggable="true">
          ${layer.name}
          <span data-layer-z="${layer.id}">Z ${state.z}</span>
        </button>
      `;
    })
    .join("");
  updateLayerPanel();
}

function renderPalettes() {
  paletteControl.innerHTML = palettes
    .map(
      (palette, index) => `
        <button
          class="swatch ${index === currentPalette ? "active" : ""}"
          style="--paper:${palette.paper};--ink:${palette.ink};--tone:${palette.tone}"
          data-palette="${index}"
          title="配色 ${index + 1}"
        ></button>
      `,
    )
    .join("");
}

function applyTemplate(id) {
  currentTemplate = id;
  poster.classList.remove(...templates.map((template) => `template-${template.id}`));
  poster.classList.add(`template-${id}`);
  activeTemplateName.textContent = templates.find((template) => template.id === id).name;
  renderTemplates();
}

function applyBackground(id) {
  currentBackground = id;
  const background = backgrounds.find((item) => item.id === id);
  if (!background) return;
  poster.style.setProperty("--bg-image", background.image);
  renderBackgrounds();
}

function applyCustomBackground(dataUrl) {
  currentBackground = "custom";
  poster.style.setProperty("--bg-image", `url("${dataUrl}")`);
  backgroundControl.querySelectorAll(".background-card").forEach((card) => card.classList.remove("active"));
}

function applyFont(id) {
  currentFont = id;
  poster.classList.remove(...fontModules.map((font) => `font-${font.id}`), "font-custom");
  poster.classList.add(`font-${id}`);
  renderFonts();
}

function applyPalette(index) {
  currentPalette = Number(index);
  const palette = palettes[currentPalette];
  document.documentElement.style.setProperty("--paper", palette.paper);
  document.documentElement.style.setProperty("--ink", palette.ink);
  document.documentElement.style.setProperty("--tone", palette.tone);
  document.documentElement.style.setProperty("--accent", palette.accent);
  colorControls.paper.value = palette.paper;
  colorControls.ink.value = palette.ink;
  colorControls.tone.value = palette.tone;
  colorControls.accent.value = palette.accent;
  renderPalettes();
}

function applyCustomColor(key, value) {
  document.documentElement.style.setProperty(`--${key}`, value);
}

function applyCustomSize(width, height, mode = "custom") {
  currentSize = { width: Number(width), height: Number(height), mode };
  poster.classList.remove("ratio-portrait", "ratio-square", "ratio-story", "ratio-custom");
  poster.classList.add(mode === "custom" ? "ratio-custom" : `ratio-${mode}`);
  poster.style.setProperty("--custom-ratio", `${currentSize.width} / ${currentSize.height}`);
  sizeControls.width.value = currentSize.width;
  sizeControls.height.value = currentSize.height;
  ratioControl.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.ratio === mode);
  });
  setRangeVars();
}

function reorderLayer(dragId, dropId) {
  if (!dragId || !dropId || dragId === dropId) return;
  pushHistory();
  const from = layers.findIndex((layer) => layer.id === dragId);
  const to = layers.findIndex((layer) => layer.id === dropId);
  const [moved] = layers.splice(from, 1);
  layers.splice(to, 0, moved);
  layers.forEach((layer, index) => {
    layerState[layer.id].z = (layers.length - index) * 2;
    applyLayerStyles(layer.id);
  });
  renderLayers();
}

function registerLayer(id, name, element, z = 14) {
  element.dataset.layer = id;
  layerElements[id] = element;
  layerState[id] = { x: 0, y: 0, scale: 100, rotate: 0, opacity: 100, z, visible: true };
  layers.unshift({ id, name, z });
  poster.appendChild(element);
  applyLayerStyles(id);
  renderLayers();
  selectLayer(id);
}

function addElement(type, src = "") {
  pushHistory();
  customLayerCount += 1;
  const id = `${type}${customLayerCount}`;
  if (type === "text") {
    const text = document.createElement("p");
    text.className = "free-text";
    text.textContent = "新しい文字";
    registerLayer(id, `文字 ${customLayerCount}`, text, 16);
    return;
  }
  if (type === "image") {
    const image = document.createElement("img");
    image.className = "imported-asset";
    image.src = src;
    image.alt = "";
    registerLayer(id, `图片 ${customLayerCount}`, image, 15);
    return;
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.classList.add("vector-shape", `shape-${type}`);
  if (type === "circle") {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "42");
    svg.appendChild(circle);
  } else if (type === "rect") {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "10");
    rect.setAttribute("y", "18");
    rect.setAttribute("width", "80");
    rect.setAttribute("height", "64");
    rect.setAttribute("rx", "4");
    svg.appendChild(rect);
  } else {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M8 50H92");
    svg.appendChild(path);
  }
  registerLayer(id, `矢量${type === "rect" ? "矩形" : type === "circle" ? "圆形" : "线条"} ${customLayerCount}`, svg, 14);
}

function deleteActiveLayer() {
  if (layers.length <= 1) return;
  pushHistory();
  const element = getLayerElement(activeLayer);
  element?.remove();
  delete layerElements[activeLayer];
  delete layerState[activeLayer];
  layers = layers.filter((layer) => layer.id !== activeLayer);
  activeLayer = layers[0]?.id || "bg";
  renderLayers();
  syncLayerControls();
}

function duplicateActiveLayer() {
  const source = getLayerElement(activeLayer);
  if (!source) return;
  pushHistory();
  customLayerCount += 1;
  const id = `${activeLayer}Copy${customLayerCount}`;
  const clone = source.cloneNode(true);
  clone.classList.remove("selected-layer");
  const base = layerState[activeLayer];
  registerLayer(id, `${layers.find((layer) => layer.id === activeLayer)?.name || "图层"} 副本`, clone, base.z + 1);
  layerState[id] = { ...base, x: base.x + 24, y: base.y + 24, z: base.z + 1 };
  applyLayerStyles(id);
  syncLayerControls();
}

function nudgeActiveLayer(dx, dy) {
  const state = layerState[activeLayer];
  if (!state) return;
  state.x += dx;
  state.y += dy;
  applyLayerStyles(activeLayer);
  syncLayerControls();
}

function arrangeActiveLayer(delta) {
  const state = layerState[activeLayer];
  if (!state) return;
  pushHistory();
  state.z = Math.max(0, Math.min(40, state.z + delta));
  applyLayerStyles(activeLayer);
  updateLayerPanel();
}

function applyMotion() {
  poster.classList.toggle("dynamic-mode", motionControls.toggle.checked);
  poster.classList.remove("motion-float", "motion-pulse", "motion-slide");
  poster.classList.add(`motion-${currentMotionMode}`);
  poster.style.setProperty("--motion-speed", motionControls.speed.value);
}

function setMotionAsset(dataUrl) {
  let asset = getLayerElement("motionAsset");
  if (!asset) {
    asset = document.createElement("img");
    asset.className = "motion-asset";
    asset.alt = "";
    registerLayer("motionAsset", "动态素材", asset, 16);
  }
  asset.src = dataUrl;
  motionControls.toggle.checked = true;
  applyMotion();
}

function bindContent() {
  Object.values(fields).forEach(([input, output]) => {
    input.addEventListener("focus", pushHistory);
    input.addEventListener("input", () => {
      output.textContent = input.value;
    });
  });
}

function getLayerElement(id) {
  if (!layerElements[id]) layerElements[id] = poster.querySelector(`[data-layer="${id}"]`);
  return layerElements[id];
}

function applyLayerStyles(id) {
  const element = getLayerElement(id);
  const state = layerState[id];
  if (!element || !state) return;
  element.style.setProperty("--layer-x", `${state.x}px`);
  element.style.setProperty("--layer-y", `${state.y}px`);
  element.style.setProperty("--layer-scale", state.scale / 100);
  element.style.setProperty("--layer-rotate", `${state.rotate}deg`);
  element.style.setProperty("--layer-opacity", state.opacity / 100);
  element.style.zIndex = state.z;
  element.hidden = !state.visible;
}

function applyAllLayerStyles() {
  layers.forEach((layer) => applyLayerStyles(layer.id));
}

function syncLayerControls() {
  const state = layerState[activeLayer];
  layerControls.visible.checked = state.visible;
  layerControls.x.value = state.x;
  layerControls.y.value = state.y;
  layerControls.scale.value = state.scale;
  layerControls.rotate.value = state.rotate;
  layerControls.opacity.value = state.opacity;
  layerControls.z.value = state.z;
  poster.querySelectorAll("[data-layer]").forEach((element) => {
    element.classList.toggle("selected-layer", element.dataset.layer === activeLayer);
  });
  updateLayerPanel();
}

function updateLayerPanel() {
  activeLayerName.textContent = layers.find((layer) => layer.id === activeLayer).name;
  layerList.querySelectorAll("[data-select-layer]").forEach((item) => {
    item.classList.toggle("active", item.dataset.selectLayer === activeLayer);
  });
  layers.forEach((layer) => {
    const zLabel = layerList.querySelector(`[data-layer-z="${layer.id}"]`);
    if (zLabel) zLabel.textContent = `Z ${layerState[layer.id].z}`;
  });
}

function selectLayer(id) {
  activeLayer = id;
  syncLayerControls();
}

function updateActiveLayer(key, value) {
  layerState[activeLayer][key] = key === "visible" ? value : Number(value);
  applyLayerStyles(activeLayer);
  updateLayerPanel();
}

function resetActiveLayer() {
  const base = layers.find((layer) => layer.id === activeLayer);
  layerState[activeLayer] = { x: 0, y: 0, scale: 100, rotate: 0, opacity: 100, z: base.z, visible: true };
  applyLayerStyles(activeLayer);
  syncLayerControls();
}

function setRatio(ratio) {
  const sizes = {
    portrait: [1080, 1350],
    square: [1080, 1080],
    story: [1080, 1920],
  };
  applyCustomSize(sizes[ratio][0], sizes[ratio][1], ratio);
}

function setRangeVars() {
  const scale = document.querySelector("#scaleInput").value;
  const density = document.querySelector("#densityInput").value;
  const shade = document.querySelector("#imageShadeInput").value;
  const blur = document.querySelector("#imageBlurInput").value;
  const isStory = poster.classList.contains("ratio-story");
  const maxSize = isStory ? 40 + Number(scale) / 3.8 : 52 + Number(scale) / 2.6;
  const fluidSize = isStory ? 3.1 + Number(scale) / 42 : 3.8 + Number(scale) / 34;
  poster.style.setProperty("--title-size", `clamp(28px, ${fluidSize}vw, ${maxSize}px)`);
  poster.style.setProperty("--density", `${Number(density) / 5}px`);
  poster.style.setProperty("--image-shade", `${Number(shade) / 140}`);
  poster.style.setProperty("--image-blur", `${Number(blur) / 16}px`);
}

function randomize() {
  applyTemplate(templates[Math.floor(Math.random() * templates.length)].id);
  applyPalette(Math.floor(Math.random() * palettes.length));
  applyBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)].id);
  applyFont(fontModules[Math.floor(Math.random() * fontModules.length)].id);
  setRatio(["portrait", "square", "story"][Math.floor(Math.random() * 3)]);
  document.querySelector("#scaleInput").value = 24 + Math.floor(Math.random() * 52);
  document.querySelector("#densityInput").value = 12 + Math.floor(Math.random() * 54);
  setRangeVars();
}

async function exportPoster() {
  const rect = poster.getBoundingClientRect();
  const scale = 2;
  const posterClone = poster.cloneNode(true);
  posterClone.querySelectorAll(".selected-layer").forEach((element) => element.classList.remove("selected-layer"));
  if (!cachedExportCss) {
    cachedExportCss = [...document.styleSheets]
      .map((sheet) => [...sheet.cssRules].map((rule) => rule.cssText).join("\n"))
      .join("\n");
  }
  const markup = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width * scale}" height="${rect.height * scale}" viewBox="0 0 ${rect.width} ${rect.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${cachedExportCss}</style>
          ${posterClone.outerHTML}
        </div>
      </foreignObject>
    </svg>
  `;
  const svgBlob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "poster-atelier.png";
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  };

  image.src = url;
}

templateList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-template]");
  if (card) {
    pushHistory();
    applyTemplate(card.dataset.template);
  }
});

paletteControl.addEventListener("click", (event) => {
  const swatch = event.target.closest("[data-palette]");
  if (swatch) {
    pushHistory();
    applyPalette(swatch.dataset.palette);
  }
});

backgroundControl.addEventListener("click", (event) => {
  const card = event.target.closest("[data-background]");
  if (card) {
    pushHistory();
    applyBackground(card.dataset.background);
  }
});

fontControl.addEventListener("click", (event) => {
  const card = event.target.closest("[data-font]");
  if (card) {
    pushHistory();
    applyFont(card.dataset.font);
  }
});

layerList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-select-layer]");
  if (item) selectLayer(item.dataset.selectLayer);
});

layerList.addEventListener("dragstart", (event) => {
  const item = event.target.closest("[data-select-layer]");
  if (!item) return;
  event.dataTransfer.setData("text/plain", item.dataset.selectLayer);
  event.dataTransfer.effectAllowed = "move";
});

layerList.addEventListener("dragover", (event) => {
  const item = event.target.closest("[data-select-layer]");
  if (!item) return;
  event.preventDefault();
  item.classList.add("drag-over");
});

layerList.addEventListener("dragleave", (event) => {
  event.target.closest("[data-select-layer]")?.classList.remove("drag-over");
});

layerList.addEventListener("drop", (event) => {
  const item = event.target.closest("[data-select-layer]");
  if (!item) return;
  event.preventDefault();
  item.classList.remove("drag-over");
  reorderLayer(event.dataTransfer.getData("text/plain"), item.dataset.selectLayer);
});

document.querySelector("#deleteLayerBtn").addEventListener("click", deleteActiveLayer);

document.querySelectorAll("[data-add-element]").forEach((button) => {
  button.addEventListener("click", () => addElement(button.dataset.addElement));
});

document.querySelector("#elementInput").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => addElement("image", reader.result));
  reader.readAsDataURL(file);
});

poster.addEventListener("click", (event) => {
  const target = event.target.closest("[data-layer]");
  if (target && poster.contains(target)) selectLayer(target.dataset.layer);
});

poster.addEventListener("pointerdown", (event) => {
  pushHistory();
  const target = event.target.closest("[data-layer]");
  if (target && poster.contains(target)) selectLayer(target.dataset.layer);
  const state = layerState[activeLayer];
  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    layerX: state.x,
    layerY: state.y,
  };
  poster.setPointerCapture(event.pointerId);
});

poster.addEventListener("pointermove", (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const state = layerState[activeLayer];
  state.x = Math.round(dragState.layerX + event.clientX - dragState.startX);
  state.y = Math.round(dragState.layerY + event.clientY - dragState.startY);
  if (layerFrame) return;
  layerFrame = requestAnimationFrame(() => {
    applyLayerStyles(activeLayer);
    layerControls.x.value = state.x;
    layerControls.y.value = state.y;
    layerFrame = 0;
  });
});

poster.addEventListener("pointerup", (event) => {
  if (dragState?.pointerId === event.pointerId) dragState = null;
});

poster.addEventListener("pointercancel", () => {
  dragState = null;
});

ratioControl.addEventListener("click", (event) => {
  if (event.target.dataset.ratio) {
    pushHistory();
    setRatio(event.target.dataset.ratio);
  }
});

document.querySelector("#scaleInput").addEventListener("pointerdown", pushHistory);
document.querySelector("#densityInput").addEventListener("pointerdown", pushHistory);
document.querySelector("#imageShadeInput").addEventListener("pointerdown", pushHistory);
document.querySelector("#imageBlurInput").addEventListener("pointerdown", pushHistory);
document.querySelector("#scaleInput").addEventListener("input", setRangeVars);
document.querySelector("#densityInput").addEventListener("input", setRangeVars);
document.querySelector("#imageShadeInput").addEventListener("input", setRangeVars);
document.querySelector("#imageBlurInput").addEventListener("input", setRangeVars);
document.querySelector("#imageInput").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  pushHistory();
  const reader = new FileReader();
  reader.addEventListener("load", () => applyCustomBackground(reader.result));
  reader.readAsDataURL(file);
});
Object.values(layerControls).forEach((control) => control.addEventListener("pointerdown", pushHistory));
layerControls.visible.addEventListener("change", (event) => {
  pushHistory();
  updateActiveLayer("visible", event.target.checked);
});
layerControls.x.addEventListener("input", (event) => updateActiveLayer("x", event.target.value));
layerControls.y.addEventListener("input", (event) => updateActiveLayer("y", event.target.value));
layerControls.scale.addEventListener("input", (event) => updateActiveLayer("scale", event.target.value));
layerControls.rotate.addEventListener("input", (event) => updateActiveLayer("rotate", event.target.value));
layerControls.opacity.addEventListener("input", (event) => updateActiveLayer("opacity", event.target.value));
layerControls.z.addEventListener("input", (event) => updateActiveLayer("z", event.target.value));
document.querySelector("#resetLayerBtn").addEventListener("click", () => {
  pushHistory();
  resetActiveLayer();
});
document.querySelector("#randomizeBtn").addEventListener("click", () => {
  pushHistory();
  randomize();
});
document.querySelector("#exportBtn").addEventListener("click", exportPoster);
document.querySelector("#undoBtn").addEventListener("click", undo);
document.querySelector("#redoBtn").addEventListener("click", redo);
document.querySelector("#applySizeBtn").addEventListener("click", () => {
  pushHistory();
  applyCustomSize(sizeControls.width.value, sizeControls.height.value, "custom");
});

Object.entries(colorControls).forEach(([key, input]) => {
  input.addEventListener("pointerdown", pushHistory);
  input.addEventListener("input", (event) => applyCustomColor(key, event.target.value));
});

document.querySelector("#fontInput").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  pushHistory();
  const name = `CustomFont${Date.now()}`;
  const font = new FontFace(name, await file.arrayBuffer());
  await font.load();
  document.fonts.add(font);
  document.documentElement.style.setProperty("--custom-font-family", `"${name}"`);
  currentFont = "custom";
  poster.classList.remove(...fontModules.map((item) => `font-${item.id}`));
  poster.classList.add("font-custom");
  fontControl.querySelectorAll(".font-card").forEach((card) => card.classList.remove("active"));
});

motionControls.toggle.addEventListener("change", applyMotion);
motionControls.speed.addEventListener("input", applyMotion);
motionControls.modes.addEventListener("click", (event) => {
  if (!event.target.dataset.motion) return;
  currentMotionMode = event.target.dataset.motion;
  motionControls.modes.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.motion === currentMotionMode);
  });
  applyMotion();
});
motionControls.asset.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  pushHistory();
  const reader = new FileReader();
  reader.addEventListener("load", () => setMotionAsset(reader.result));
  reader.readAsDataURL(file);
});

document.addEventListener("keydown", (event) => {
  const editing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
  const isModifier = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();
  if (isModifier && key === "z" && event.shiftKey) {
    event.preventDefault();
    redo();
  } else if (isModifier && key === "z") {
    event.preventDefault();
    undo();
  } else if (isModifier && key === "y") {
    event.preventDefault();
    redo();
  } else if (editing) {
    return;
  } else if (key === "delete" || key === "backspace") {
    event.preventDefault();
    deleteActiveLayer();
  } else if (isModifier && key === "d") {
    event.preventDefault();
    duplicateActiveLayer();
  } else if (isModifier && event.key === "]") {
    event.preventDefault();
    arrangeActiveLayer(event.shiftKey ? 10 : 1);
  } else if (isModifier && event.key === "[") {
    event.preventDefault();
    arrangeActiveLayer(event.shiftKey ? -10 : -1);
  } else if (key === "arrowup" || key === "arrowdown" || key === "arrowleft" || key === "arrowright") {
    event.preventDefault();
    const step = event.shiftKey ? 10 : 1;
    const map = {
      arrowup: [0, -step],
      arrowdown: [0, step],
      arrowleft: [-step, 0],
      arrowright: [step, 0],
    };
    nudgeActiveLayer(...map[key]);
  } else if (key === "t") {
    event.preventDefault();
    addElement("text");
  } else if (key === "m") {
    event.preventDefault();
    addElement("rect");
  } else if (key === "l") {
    event.preventDefault();
    addElement("circle");
  } else if (key === "p") {
    event.preventDefault();
    addElement("line");
  }
});

renderTemplates();
renderBackgrounds();
renderFonts();
renderLayers();
renderPalettes();
applyBackground(currentBackground);
applyFont(currentFont);
applyAllLayerStyles();
bindContent();
syncLayerControls();
setRangeVars();

function setText(key, value) {
  const pair = fields[key];
  if (!pair) return;
  pushHistory();
  pair[0].value = value;
  pair[1].textContent = value;
}

function setLayerStyle(id, key, value) {
  const state = layerState[id];
  if (!state) return;
  pushHistory();
  if (key === "visible") {
    state.visible = !!value;
  } else {
    state[key] = Number(value);
  }
  applyLayerStyles(id);
  if (id === activeLayer) {
    syncLayerControls();
  } else {
    updateLayerPanel();
  }
}

window.posterEditor = {
  getState: () => {
    return {
      currentTemplate,
      currentPalette: palettes[currentPalette] || palettes[0],
      paletteIndex: currentPalette,
      currentBackground,
      currentFont,
      activeLayer,
      currentSize,
      layers: layers.map(l => ({
        id: l.id,
        name: l.name,
        state: layerState[l.id]
      })),
      text: {
        kicker: fields.kicker[0].value,
        title: fields.title[0].value,
        subtitle: fields.subtitle[0].value,
        date: fields.date[0].value,
        place: fields.place[0].value
      },
      colors: {
        paper: colorControls.paper.value,
        ink: colorControls.ink.value,
        tone: colorControls.tone.value,
        accent: colorControls.accent.value
      },
      motion: {
        enabled: motionControls.toggle.checked,
        mode: currentMotionMode,
        speed: motionControls.speed.value
      }
    };
  },
  applyTemplate: (id) => {
    pushHistory();
    applyTemplate(id);
  },
  applyPalette: (index) => {
    pushHistory();
    applyPalette(index);
  },
  applyCustomColor: (key, value) => {
    pushHistory();
    colorControls[key].value = value;
    applyCustomColor(key, value);
  },
  applyBackground: (id) => {
    pushHistory();
    applyBackground(id);
  },
  applyFont: (id) => {
    pushHistory();
    applyFont(id);
  },
  setRatio: (ratio) => {
    pushHistory();
    setRatio(ratio);
  },
  applyCustomSize: (width, height) => {
    pushHistory();
    applyCustomSize(width, height, "custom");
  },
  setText: (key, value) => {
    setText(key, value);
  },
  setLayerStyle: (id, key, value) => {
    setLayerStyle(id, key, value);
  },
  selectLayer: (id) => {
    selectLayer(id);
  },
  addElement: (type) => {
    addElement(type);
  },
  deleteActiveLayer: () => {
    deleteActiveLayer();
  },
  duplicateActiveLayer: () => {
    duplicateActiveLayer();
  },
  randomize: () => {
    pushHistory();
    randomize();
  },
  undo: () => {
    undo();
  },
  redo: () => {
    redo();
  },
  exportPoster: () => {
    exportPoster();
  },
  setMotion: (enabled, mode, speed) => {
    pushHistory();
    motionControls.toggle.checked = enabled;
    if (mode) {
      currentMotionMode = mode;
      motionControls.modes.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.motion === currentMotionMode);
      });
    }
    if (speed) {
      motionControls.speed.value = speed;
    }
    applyMotion();
  }
};
}
