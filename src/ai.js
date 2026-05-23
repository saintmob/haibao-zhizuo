export async function sendMessageToGemini(chatHistory) {
  const apiKey = localStorage.getItem("gemini_api_key");
  const modelName = localStorage.getItem("gemini_model") || "gemini-3.5-flash";

  if (!apiKey) {
    throw new Error("API Key 未配置，请先在设置中填写。");
  }

  // Get current state to inject into the prompt
  const posterState = window.posterEditor ? window.posterEditor.getState() : {};

  // System prompt guiding Gemini to act as a design assistant and output JSON
  const systemPrompt = `You are a professional graphic design assistant for the Tokyo Layout Room poster editor.
The user will describe their design ideas or request changes to their poster.
You must respond in JSON format matching the schema provided.

Supported templates (templateId):
- editorial (Shashin Margin, lifestyle photo layout)
- gallery (Muji Note, minimal info grid)
- index (Kissa Menu, cafe menu catalog style)
- split (Ticket Stub, event coupon style)
- cover (Tategaki, vertical Japanese book spine style)
- modern (City Pop Grid, retro pop color blocks)
- archive (Zine Collage, handmade indie magazine style)
- neo (Neo Grid, modern branding grid)
- typewave (Type Wave, big bold wave typography)
- minimaltech (Minimal Tech, tech release style)
- maximal (Maximal Pop, bold collage colors)

Supported backgrounds (backgroundId):
- amber (Milk Tea warm gradient)
- mono (Window Light cool grey)
- cyan (Soda Blue refreshing cyan)
- rose (Sakura Paper soft pink)
- green (Matcha aesthetic green)
- blue (Evening Train sunset blue)

Supported fonts (fontId):
- didot (Japanese Editorial Serif / 日杂衬线)
- grotesk (Narrow Headline / 窄体刊头)
- song (Ming 朝/Songti / 明朝书感)
- minimal (Muji light sans / 无印轻体)
- brutal (Heisei Bold Rounded / 平成粗圆)
- noto-sans (Noto Sans)
- noto-serif (Noto Serif)
- zen-maru (Zen Maru Gothic)
- m-plus (M PLUS Japanese)
- roboto-condensed (Roboto Condensed)

Supported ratio values:
- portrait (1080x1350)
- square (1080x1080)
- story (1080x1920)

Supported custom colors keys:
- paper (background canvas color)
- ink (primary text/line color)
- tone (accent graphics/shapes color)
- accent (highlight accent color)

Supported text fields:
- kicker (眉标)
- title (标题)
- subtitle (副标题)
- date (日期)
- place (地点)

Supported layer IDs:
- title, kicker, subtitle, meta, shapeCircle, shapeRect, shapeLine, art, grain, bg (or custom layer IDs like text1, rect2, etc.)
Supported style keys for layer properties:
- visible (boolean)
- x (number, range -220 to 220)
- y (number, range -220 to 220)
- scale (number, range 40 to 180, percentage e.g. 100 means 1.0)
- rotate (number, range -35 to 35)
- opacity (number, range 0 to 100)
- z (number, range 0 to 20)

Supported element types:
- text, circle, rect, line

Current Poster State:
${JSON.stringify(posterState)}

Your JSON response must contain:
1. "reply": A friendly, concise response in Chinese explaining what changes you made. Tell the user your design ideas. If user's request is out of scope (e.g. general chat, math, programming, coding, writing essays, recipes), reply politely and wittily in Chinese that you are a design assistant and cannot answer that, then offer design suggestions.
2. "actions": An array of actions to execute sequentially.
Each action must be an object with "name" and "args" (optional):
- { "name": "applyTemplate", "args": { "templateId": "..." } }
- { "name": "applyPalette", "args": { "paletteIndex": 0..9 } }
- { "name": "applyCustomColor", "args": { "colorKey": "...", "hexValue": "#HEX" } }
- { "name": "applyBackground", "args": { "backgroundId": "..." } }
- { "name": "applyFont", "args": { "fontId": "..." } }
- { "name": "setRatio", "args": { "ratio": "..." } }
- { "name": "applyCustomSize", "args": { "width": 1080, "height": 1350 } }
- { "name": "setText", "args": { "key": "kicker"|"title"|"subtitle"|"date"|"place", "value": "..." } }
- { "name": "setLayerStyle", "args": { "id": "...", "key": "visible"|"x"|"y"|"scale"|"rotate"|"opacity"|"z", "value": number_or_boolean } }
- { "name": "selectLayer", "args": { "id": "..." } }
- { "name": "addElement", "args": { "type": "text"|"circle"|"rect"|"line" } }
- { "name": "deleteActiveLayer", "args": {} }
- { "name": "duplicateActiveLayer", "args": {} }
- { "name": "randomize", "args": {} }
- { "name": "undo", "args": {} }
- { "name": "redo", "args": {} }
- { "name": "setMotion", "args": { "enabled": boolean, "mode": "float"|"pulse"|"slide", "speed": number } }

3. "suggestions": Exactly 3 smart suggestion strings (in Chinese) for what the user could say next. E.g. ["帮我把配色换成晚霞风格", "将标题移到中心", "开启动态浮动动效"].

Guidelines:
- If the user says "make the title larger", you should increase the scale value of the "title" layer (e.g. from 100 to 130).
- If the user says "move the title a bit down", increase its "y" property.
- When changing properties, always read the current state to compute the relative change if appropriate, but output the absolute new value.
- Ensure all actions apply correct argument types (e.g. values for x, y, scale, rotate, opacity, z must be numbers, visible must be boolean).`;

  const contents = chatHistory.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  const responseSchema = {
    type: "OBJECT",
    properties: {
      reply: { type: "STRING" },
      actions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            args: { type: "OBJECT" }
          },
          required: ["name"]
        }
      },
      suggestions: {
        type: "ARRAY",
        items: { type: "STRING" }
      }
    },
    required: ["reply", "actions", "suggestions"]
  };

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema
    }
  };

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson?.error?.message || `HTTP 错误 ${response.status}`;
      throw new Error(`Gemini API 错误: ${errMsg}`);
    }

    const resJson = await response.json();
    const textResponse = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Gemini API 未返回有效的文本内容。");
    }

    let parsed;
    try {
      parsed = JSON.parse(textResponse);
    } catch (e) {
      throw new Error("AI 返回的数据解析失败，格式不是合法的 JSON。");
    }

    if (typeof parsed.reply !== "string" || !Array.isArray(parsed.actions) || !Array.isArray(parsed.suggestions)) {
      throw new Error("AI 返回的数据不符合预期格式。");
    }

    return parsed;

  } catch (error) {
    console.error("Gemini request error:", error);
    throw error;
  }
}

export async function verifyGeminiApiKey(key, model = "gemini-3.5-flash") {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const testBody = {
      contents: [{ role: "user", parts: [{ text: "Hello" }] }],
      generationConfig: {
        maxOutputTokens: 5
      }
    };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testBody)
    });
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `HTTP ${response.status}`);
    }
    return true;
  } catch (error) {
    throw new Error(`连接测试失败: ${error.message}`);
  }
}
