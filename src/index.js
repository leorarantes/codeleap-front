import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";

import "./assets/styles/reset.css";
import "./assets/styles/index.css";

const container = document.querySelector('#root');
const root = createRoot(container);
root.render(<App />);