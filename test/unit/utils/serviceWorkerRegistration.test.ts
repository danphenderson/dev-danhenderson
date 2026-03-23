describe('serviceWorkerRegistration', () => {
  const originalFetch = global.fetch;
  const originalReadyState = document.readyState;
  const registerMock = jest.fn();
  const unregisterMock = jest.fn();
  const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

  const loadModule = async () => {
    jest.resetModules();
    jest.doMock('../../../src/utils/appEnvironment', () => ({
      readNodeEnvironment: jest.fn(() => 'production'),
      readPublicUrl: jest.fn(() => ''),
    }));
    jest.doMock('../../../src/utils/assets', () => ({
      resolvePublicAssetPath: jest.fn(() => '/service-worker.js'),
    }));

    return import('../../../src/utils/serviceWorkerRegistration');
  };

  const flushMicrotasks = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  };

  beforeEach(() => {
    registerMock.mockReset().mockResolvedValue({ installing: null });
    unregisterMock.mockReset().mockResolvedValue(true);
    consoleErrorMock.mockClear();

    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'loading',
    });

    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: registerMock,
        ready: Promise.resolve({
          unregister: unregisterMock,
        }),
        controller: null,
      },
    });

    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      headers: {
        get: () => 'application/javascript',
      },
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.dontMock('../../../src/utils/appEnvironment');
    jest.dontMock('../../../src/utils/assets');
    global.fetch = originalFetch;
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: originalReadyState,
    });
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  it('registers the service worker from a one-time load listener when the document is still loading', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const { register } = await loadModule();

    register();

    expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function), { once: true });

    const loadHandler = addEventListenerSpy.mock.calls.find(([eventName]) => eventName === 'load')?.[1] as
      | (() => void)
      | undefined;

    expect(loadHandler).toBeDefined();

    loadHandler?.();
    await flushMicrotasks();

    expect(global.fetch).toHaveBeenCalledWith('/service-worker.js', {
      headers: { 'Service-Worker': 'script' },
    });
    expect(registerMock).toHaveBeenCalledWith('/service-worker.js');
  });

  it('registers immediately when the document has already finished loading', async () => {
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      value: 'complete',
    });

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const { register } = await loadModule();

    register();
    await Promise.resolve();
    await Promise.resolve();

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function), { once: true });
    expect(registerMock).toHaveBeenCalledWith('/service-worker.js');
  });

  it('attempts invalid localhost service worker recovery without logging an error when unregister succeeds', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
      headers: {
        get: () => 'text/html',
      },
    } as Response);

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const { register } = await loadModule();
    register();

    const loadHandler = addEventListenerSpy.mock.calls.find(([eventName]) => eventName === 'load')?.[1] as
      | (() => void)
      | undefined;

    loadHandler?.();
    await flushMicrotasks();

    expect(unregisterMock).toHaveBeenCalledTimes(1);
  });

  it('logs a recovery error when an invalid service worker fails to unregister', async () => {
    unregisterMock.mockRejectedValue(new Error('unregister failed'));
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
      headers: {
        get: () => 'text/html',
      },
    } as Response);

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const { register } = await loadModule();
    register();

    const loadHandler = addEventListenerSpy.mock.calls.find(([eventName]) => eventName === 'load')?.[1] as
      | (() => void)
      | undefined;

    loadHandler?.();
    await flushMicrotasks();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error during service worker recovery:',
      expect.any(Error)
    );
  });
});
