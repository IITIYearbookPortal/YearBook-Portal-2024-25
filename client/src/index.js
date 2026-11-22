import axios from "axios";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './config/firebase-config'
import App from './App';
import { BrowserRouter } from 'react-router-dom';

axios.interceptors.request.use(config => {
  if (new URL(config.url, window.location.href).origin === new URL(process.env.REACT_APP_API_URL, window.location.href).origin) {
    config.withCredentials = true;
    config.headers["X-Yearbook-Request"] = "1";
  }
  return config;
});
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

