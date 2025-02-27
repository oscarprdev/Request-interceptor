function interceptFetch() {
  const originalFetch = window.fetch;

  window.fetch = async function (resource, init) {
    const url = resource instanceof Request ? resource.url : resource;

    if (url.includes('localhost:3000/example')) {
      console.log('Mocking response for:', url);

      const mockResponse = {
        message: 'This is a mocked response from the content script',
        timestamp: new Date().toISOString(),
      };

      return new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return originalFetch.apply(this, arguments);
  };
}

function injectScript() {
  const script = document.createElement('script');
  script.textContent = `
    (${interceptFetch.toString()})();
  `;
  document.documentElement.appendChild(script);
  script.remove();
}

injectScript();
