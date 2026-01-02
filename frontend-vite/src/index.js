import React from "react";
import ReactDOM from "react-dom/client"; // for React 18+
import App from "./App.jsx"; // .jsx ya .js, jo tumhara main file hai
import "./index.css"; // agar CSS hai

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
