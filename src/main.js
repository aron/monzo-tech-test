import { render, h } from '../vendor/preact.js';
import AppContainer from './components/app.js';

(function main() {
  window.addEventListener("unhandledrejection", function (event) {
    // TODO: Log to external service.
    console.warn(`WARNING: Unhandled promise rejection. Reason: ${event.reason}`);
  });
  const root = document.getElementById('main');
  render(h(AppContainer, null), root);
})();

//# sourceMappingURL=main.js.map