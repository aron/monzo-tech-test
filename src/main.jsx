import {render, h} from '../vendor/preact.js';
import AppContainer from './components/app.js';

/**
 * The entry point into the applicaton. This should be loaded from a <script> tag in the root HTML doc.
 */
(function main() {
  // Make sure we're aware of unhandled Promise rejections.
  window.addEventListener("unhandledrejection", function (event) {
    // TODO: Log to external service.
    console.warn(`WARNING: Unhandled promise rejection. Reason: ${event.reason}`);
  });

  const root = document.getElementById('main');
  render(<AppContainer />, root);
})();