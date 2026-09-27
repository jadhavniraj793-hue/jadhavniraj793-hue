import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Fade out the pre-React boot loader once the first paint has happened.
requestAnimationFrame(() => {
  const loader = document.getElementById('boot-loader');
  if (!loader) return;
  loader.classList.add('is-done');
  setTimeout(() => loader.remove(), 700);
});
