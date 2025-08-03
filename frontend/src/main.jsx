import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // tailwind styles
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Global axios config
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;
ReactDOM.createRoot(document.getElementById("root")).render(
  // ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
