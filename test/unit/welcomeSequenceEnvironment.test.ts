import { shouldResetWelcomeSequenceOnHomeLoad } from '../../src/welcomeSequenceEnvironment';

describe('shouldResetWelcomeSequenceOnHomeLoad', () => {
  it('returns true for development loads on the home path', () => {
    expect(
      shouldResetWelcomeSequenceOnHomeLoad({
        runtimeEnvironment: 'development',
        pathname: '/',
        publicUrl: '',
      })
    ).toBe(true);
  });

  it('returns true when the pathname matches a public-url homepage', () => {
    expect(
      shouldResetWelcomeSequenceOnHomeLoad({
        runtimeEnvironment: 'development',
        pathname: '/portfolio/',
        publicUrl: '/portfolio',
      })
    ).toBe(true);
  });

  it('returns false outside development', () => {
    expect(
      shouldResetWelcomeSequenceOnHomeLoad({
        runtimeEnvironment: 'test',
        pathname: '/',
        publicUrl: '',
      })
    ).toBe(false);
    expect(
      shouldResetWelcomeSequenceOnHomeLoad({
        runtimeEnvironment: 'production',
        pathname: '/',
        publicUrl: '',
      })
    ).toBe(false);
  });

  it('returns false for non-home development routes', () => {
    expect(
      shouldResetWelcomeSequenceOnHomeLoad({
        runtimeEnvironment: 'development',
        pathname: '/cv',
        publicUrl: '',
      })
    ).toBe(false);
  });
});
