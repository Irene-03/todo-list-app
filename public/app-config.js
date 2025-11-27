(function initAppConfig(){
  window.APP_CONFIG = window.APP_CONFIG || {};
  if (typeof window.APP_CONFIG.apiKey === "undefined") {
    window.APP_CONFIG.apiKey = "your-secret-api-key-here";
  }
})();
