import React from "react";

export default function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="mark" />
          <div>
            <p className="eyebrow">Tokyo Layout Room</p>
            <h1>日系海报排版工作台</h1>
          </div>
        </div>

        <section className="panel">
          <div className="panel-head">
            <h2>排版风格</h2>
            <span id="templateCount"></span>
          </div>
          <div className="template-list" id="templateList"></div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>画幅</h2>
          </div>
          <div className="segmented" id="ratioControl">
            <button className="active" data-ratio="portrait">竖版</button>
            <button data-ratio="square">方形</button>
            <button data-ratio="story">长图</button>
          </div>
          <div className="field-grid compact-grid">
            <label>
              <span>宽 px</span>
              <input id="customWidthInput" type="number" min="240" max="3000" defaultValue="1080" />
            </label>
            <label>
              <span>高 px</span>
              <input id="customHeightInput" type="number" min="240" max="4000" defaultValue="1350" />
            </label>
          </div>
          <button className="text-button full-button" id="applySizeBtn">应用自定义尺寸</button>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>图层</h2>
            <span id="activeLayerName">标题</span>
          </div>
          <div className="layer-list" id="layerList"></div>
          <button className="text-button full-button" id="deleteLayerBtn">删除选中图层</button>
        </section>
      </aside>

      <section className="stage-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">实时预览</p>
            <h2 id="activeTemplateName">Shashin Margin</h2>
          </div>
          <div className="toolbar">
            <button className="icon-button" id="undoBtn" title="撤销 Cmd/Ctrl+Z">
              <span aria-hidden="true">↶</span>
            </button>
            <button className="icon-button" id="redoBtn" title="重做 Cmd/Ctrl+Shift+Z / Ctrl+Y">
              <span aria-hidden="true">↷</span>
            </button>
            <button className="icon-button" id="randomizeBtn" title="随机组合">
              <span aria-hidden="true">↻</span>
            </button>
            <button className="text-button" id="exportBtn">导出 PNG</button>
          </div>
        </header>

        <div className="canvas-wrap">
          <article className="poster template-editorial ratio-portrait" id="posterCanvas">
            <div className="poster-bg" id="posterBg" data-layer="bg"></div>
            <div className="poster-grain" data-layer="grain"></div>
            <div className="poster-art" id="posterArt" data-layer="art"></div>
            <svg className="vector-shape shape-circle" data-layer="shapeCircle" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="42"></circle>
            </svg>
            <svg className="vector-shape shape-rect" data-layer="shapeRect" viewBox="0 0 100 100" aria-hidden="true">
              <rect x="10" y="18" width="80" height="64" rx="4"></rect>
            </svg>
            <svg className="vector-shape shape-line" data-layer="shapeLine" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M8 50H92"></path>
            </svg>
            <div className="poster-content">
              <p className="poster-kicker" id="posterKicker" data-layer="kicker">小さな週末</p>
              <h3 className="poster-title" id="posterTitle" data-layer="title">春日散策</h3>
              <p className="poster-subtitle" id="posterSubtitle" data-layer="subtitle">午后四点的光、街角的咖啡与慢慢经过的风。把日常放进一张安静的纸面。</p>
              <div className="poster-meta" data-layer="meta">
                <span id="posterDate">2026.06.18</span>
                <span id="posterPlace">Kichijoji</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <aside className="inspector">
        <section className="panel">
          <div className="panel-head">
            <h2>底图</h2>
          </div>
          <label className="upload-box">
            <span>上传自己的底图</span>
            <input id="imageInput" type="file" accept="image/*" />
          </label>
          <div className="background-list" id="backgroundControl"></div>
          <label>
            <span>底图明暗</span>
            <input id="imageShadeInput" type="range" min="0" max="100" defaultValue="18" />
          </label>
          <label>
            <span>底图模糊</span>
            <input id="imageBlurInput" type="range" min="0" max="100" defaultValue="0" />
          </label>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>新增元素</h2>
          </div>
          <div className="element-actions">
            <button className="mini-button" data-add-element="text">文字</button>
            <button className="mini-button" data-add-element="circle">圆形</button>
            <button className="mini-button" data-add-element="rect">矩形</button>
            <button className="mini-button" data-add-element="line">线条</button>
          </div>
          <label className="upload-box">
            <span>导入图片元素</span>
            <input id="elementInput" type="file" accept="image/*" />
          </label>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>动态海报</h2>
          </div>
          <label className="toggle-line">
            <span>开启动态预览</span>
            <input id="motionToggle" type="checkbox" />
          </label>
          <div className="segmented motion-modes" id="motionModeControl">
            <button className="active" data-motion="float">漂浮</button>
            <button data-motion="pulse">呼吸</button>
            <button data-motion="slide">横移</button>
          </div>
          <label>
            <span>速度</span>
            <input id="motionSpeedInput" type="range" min="4" max="24" defaultValue="10" />
          </label>
          <label className="upload-box">
            <span>替换动态物体</span>
            <input id="motionAssetInput" type="file" accept="image/*" />
          </label>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>内容</h2>
          </div>
          <label>
            <span>眉标</span>
            <input id="kickerInput" defaultValue="小さな週末" />
          </label>
          <label>
            <span>标题</span>
            <textarea id="titleInput" rows="3" defaultValue="春日散策"></textarea>
          </label>
          <label>
            <span>副标题</span>
            <textarea id="subtitleInput" rows="4" defaultValue="午后四点的光、街角的咖啡与慢慢经过的风。把日常放进一张安静的纸面。"></textarea>
          </label>
          <div className="field-grid">
            <label>
              <span>日期</span>
              <input id="dateInput" defaultValue="2026.06.18" />
            </label>
            <label>
              <span>地点</span>
              <input id="placeInput" defaultValue="Kichijoji" />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>字体模块</h2>
          </div>
          <label className="upload-box">
            <span>导入字体文件</span>
            <input id="fontInput" type="file" accept=".ttf,.otf,.woff,.woff2,font/*" />
          </label>
          <div className="font-list" id="fontControl"></div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>选中图层细节</h2>
            <button className="mini-button" id="resetLayerBtn">重置</button>
          </div>
          <label className="toggle-line">
            <span>显示图层</span>
            <input id="layerVisibleInput" type="checkbox" defaultChecked />
          </label>
          <div className="field-grid">
            <label>
              <span>X 位置</span>
              <input id="layerXInput" type="range" min="-220" max="220" defaultValue="0" />
            </label>
            <label>
              <span>Y 位置</span>
              <input id="layerYInput" type="range" min="-220" max="220" defaultValue="0" />
            </label>
          </div>
          <div className="field-grid">
            <label>
              <span>缩放</span>
              <input id="layerScaleInput" type="range" min="40" max="180" defaultValue="100" />
            </label>
            <label>
              <span>旋转</span>
              <input id="layerRotateInput" type="range" min="-35" max="35" defaultValue="0" />
            </label>
          </div>
          <div className="field-grid">
            <label>
              <span>透明度</span>
              <input id="layerOpacityInput" type="range" min="0" max="100" defaultValue="100" />
            </label>
            <label>
              <span>层级</span>
              <input id="layerZInput" type="range" min="0" max="20" defaultValue="10" />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>色彩与细节</h2>
          </div>
          <div className="swatches" id="paletteControl"></div>
          <div className="color-grid">
            <label>
              <span>纸张</span>
              <input id="paperColorInput" type="color" defaultValue="#fbf7ed" />
            </label>
            <label>
              <span>文字</span>
              <input id="inkColorInput" type="color" defaultValue="#2c2b27" />
            </label>
            <label>
              <span>图形</span>
              <input id="toneColorInput" type="color" defaultValue="#9cc8c2" />
            </label>
            <label>
              <span>强调</span>
              <input id="accentColorInput" type="color" defaultValue="#e86f5b" />
            </label>
          </div>
          <label>
            <span>标题强度</span>
            <input id="scaleInput" type="range" min="0" max="100" defaultValue="42" />
          </label>
          <label>
            <span>画面密度</span>
            <input id="densityInput" type="range" min="0" max="100" defaultValue="32" />
          </label>
        </section>
      </aside>
    </main>
  );
}
