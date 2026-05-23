import React, { useState, useEffect, useRef } from "react";
import { sendMessageToGemini, verifyGeminiApiKey } from "./ai.js";

export default function App() {
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [selectedModel, setSelectedModel] = useState(localStorage.getItem("gemini_model") || "gemini-3.5-flash");
  
  // Settings Modal State
  const [inputApiKey, setInputApiKey] = useState(apiKey);
  const [inputModel, setInputModel] = useState(selectedModel);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [validationSuccess, setValidationSuccess] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "您好！我是您的 AI 智能排版助手。您可以直接告诉我您的设计想法，比如“将配色改为温暖的晚霞风格，标题写上‘秋日物语’”，或者“帮我把标题放大并向右移动”。"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "随机组合配色与模板",
    "应用日杂衬线字体",
    "切换到正方形画幅"
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  // Sync API key state with local storage when state changes
  useEffect(() => {
    setInputApiKey(apiKey);
  }, [apiKey]);

  const handleSaveSettings = async () => {
    setValidationError("");
    setValidationSuccess(false);
    
    if (!inputApiKey.trim()) {
      setValidationError("请输入 API Key");
      return;
    }

    setIsValidatingKey(true);
    try {
      await verifyGeminiApiKey(inputApiKey.trim(), inputModel);
      localStorage.setItem("gemini_api_key", inputApiKey.trim());
      localStorage.setItem("gemini_model", inputModel);
      setApiKey(inputApiKey.trim());
      setSelectedModel(inputModel);
      setValidationSuccess(true);
      setTimeout(() => {
        setShowSettingsModal(false);
        setValidationSuccess(false);
      }, 1000);
    } catch (err) {
      setValidationError(err.message || "API Key 校验失败，请检查输入或网络状况。");
    } finally {
      setIsValidatingKey(false);
    }
  };

  const executeAiActions = (actions) => {
    if (!window.posterEditor || !actions || !actions.length) return;
    actions.forEach(action => {
      const { name, args } = action;
      try {
        if (typeof window.posterEditor[name] === "function") {
          if (args) {
            if (name === "applyCustomColor") {
              window.posterEditor.applyCustomColor(args.colorKey, args.hexValue);
            } else if (name === "applyCustomSize") {
              window.posterEditor.applyCustomSize(args.width, args.height);
            } else if (name === "setText") {
              window.posterEditor.setText(args.key, args.value);
            } else if (name === "setLayerStyle") {
              window.posterEditor.setLayerStyle(args.id, args.key, args.value);
            } else if (name === "addElement") {
              window.posterEditor.addElement(args.type);
            } else if (name === "applyTemplate") {
              window.posterEditor.applyTemplate(args.templateId);
            } else if (name === "applyPalette") {
              window.posterEditor.applyPalette(args.paletteIndex);
            } else if (name === "applyBackground") {
              window.posterEditor.applyBackground(args.backgroundId);
            } else if (name === "applyFont") {
              window.posterEditor.applyFont(args.fontId);
            } else if (name === "setRatio") {
              window.posterEditor.setRatio(args.ratio);
            } else if (name === "selectLayer") {
              window.posterEditor.selectLayer(args.id);
            } else if (name === "setMotion") {
              window.posterEditor.setMotion(args.enabled, args.mode, args.speed);
            } else {
              window.posterEditor[name](args);
            }
          } else {
            window.posterEditor[name]();
          }
        }
      } catch (err) {
        console.error(`AI 动作执行失败 (${name}):`, err);
      }
    });
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    if (!apiKey) {
      setShowSettingsModal(true);
      return;
    }

    const newUserMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };

    setMessages(prev => [...prev, newUserMessage]);
    setChatInput("");
    setIsAiThinking(true);

    try {
      const historyToSend = [...messages, newUserMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const aiResponse = await sendMessageToGemini(historyToSend);
      
      // Execute actions returned by Gemini
      if (aiResponse.actions && aiResponse.actions.length > 0) {
        executeAiActions(aiResponse.actions);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.reply
      }]);

      if (aiResponse.suggestions && aiResponse.suggestions.length === 3) {
        setSuggestions(aiResponse.suggestions);
      }

    } catch (err) {
      console.error("AI Assistant response error:", err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ 出错了: ${err.message || "请求失败，请稍后重试。"}`
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

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
            <button className="text-button ai-toggle-btn" id="aiToggleBtn" onClick={() => setShowAiDrawer(!showAiDrawer)} title="AI 智能排版助手">
              <span style={{ marginRight: "4px" }}>✨</span> AI 智能排版
            </button>
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

      {/* AI Assistant Drawer */}
      <div className={`ai-drawer ${showAiDrawer ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="drawer-header-title">
            <span className="ai-sparkle">✨</span>
            <h3>AI 智能排版助手</h3>
          </div>
          <div className="drawer-header-actions">
            <button className="drawer-action-btn" onClick={() => setShowSettingsModal(true)} title="设置 API Key">⚙️</button>
            <button className="drawer-action-btn" onClick={() => setShowAiDrawer(false)} title="关闭">✕</button>
          </div>
        </div>

        <div className="drawer-chat-area">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="chat-message assistant thinking">
              <div className="chat-bubble">
                <span className="thinking-dot"></span>
                <span className="thinking-dot"></span>
                <span className="thinking-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="drawer-footer">
          <div className="suggestion-pills">
            {suggestions.map((sug, idx) => (
              <button 
                key={idx} 
                className="suggestion-pill"
                onClick={() => handleSendMessage(sug)}
                disabled={isAiThinking}
              >
                {sug}
              </button>
            ))}
          </div>
          <form className="drawer-input-form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <input
              type="text"
              placeholder={apiKey ? "输入您的设计想法..." : "请先配置 API Key..."}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isAiThinking || !apiKey}
            />
            <button type="submit" disabled={isAiThinking || !apiKey || !chatInput.trim()}>
              发送
            </button>
          </form>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => !isValidatingKey && setShowSettingsModal(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gemini API 配置</h3>
              <button className="modal-close" onClick={() => setShowSettingsModal(false)} disabled={isValidatingKey}>✕</button>
            </div>
            <div className="modal-body">
              <div className="settings-field">
                <label htmlFor="apiKeyInput">Gemini API Key</label>
                <input
                  id="apiKeyInput"
                  type="password"
                  placeholder="输入您的 Gemini API Key"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  disabled={isValidatingKey}
                />
                <p className="field-hint">您的 API Key 将只保存在本地浏览器中。</p>
              </div>

              <div className="settings-field">
                <label htmlFor="modelSelect">模型选择</label>
                <select
                  id="modelSelect"
                  value={inputModel}
                  onChange={(e) => setInputModel(e.target.value)}
                  disabled={isValidatingKey}
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (推荐)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                </select>
              </div>

              {validationError && <div className="modal-error">{validationError}</div>}
              {validationSuccess && <div className="modal-success">✓ 配置保存并校验成功！</div>}
            </div>
            <div className="modal-footer">
              <button className="text-button" onClick={() => setShowSettingsModal(false)} disabled={isValidatingKey}>
                取消
              </button>
              <button 
                className="text-button save-btn" 
                onClick={handleSaveSettings}
                disabled={isValidatingKey || !inputApiKey.trim()}
              >
                {isValidatingKey ? "校验中..." : "保存并测试"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
