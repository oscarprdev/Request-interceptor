import { initClientHandler } from './client-handler';
import { initWebRequestInterceptor } from './web-interceptor';
(async () => {
  initClientHandler();
  initWebRequestInterceptor();
})();
