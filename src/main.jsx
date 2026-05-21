import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { initPosterEditor } from "./legacy.js";
import App from "./App.jsx";

function PosterEditorApp() {
  useEffect(() => {
    initPosterEditor();
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")).render(<PosterEditorApp />);
