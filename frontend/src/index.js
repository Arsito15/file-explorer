import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';
import { App } from './components/App';
import { store } from './store/store';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      Provider,
      { store },
      React.createElement(App)
    )
  )
);
