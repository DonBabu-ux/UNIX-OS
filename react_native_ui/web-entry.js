import * as React from 'react';
window.React = React;

window.onerror = function(message, source, lineno, colno, error) {
  document.body.innerHTML = `<div style="color:white;padding:20px;background:red;"><h1>Frontend Crash</h1><p>${message}</p></div>`;
};

import { AppRegistry } from 'react-native';
import App from './App';
import name from './app.json';

AppRegistry.registerComponent(name.name, () => App);
AppRegistry.runApplication(name.name, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
