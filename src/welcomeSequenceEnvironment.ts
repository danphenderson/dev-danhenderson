import { resolveAppRuntimeEnvironment, type AppRuntimeEnvironment } from './constants/featureFlags';
import { readPublicUrl } from './utils/appEnvironment';

type WelcomeSequenceResetOptions = {
  pathname?: string;
  publicUrl?: string;
  runtimeEnvironment?: AppRuntimeEnvironment;
};

const normalizePathname = (value: string): string => {
  const trimmedValue = value.replace(/\/+$/, '');
  return trimmedValue || '/';
};

export const shouldResetWelcomeSequenceOnHomeLoad = (
  options: WelcomeSequenceResetOptions = {}
): boolean => {
  const runtimeEnvironment = options.runtimeEnvironment ?? resolveAppRuntimeEnvironment();

  if (runtimeEnvironment !== 'development') {
    return false;
  }

  if (typeof window === 'undefined' && options.pathname === undefined) {
    return false;
  }

  const pathname = normalizePathname(options.pathname ?? window.location.pathname);
  const publicUrl = normalizePathname(options.publicUrl ?? readPublicUrl());

  return pathname === publicUrl;
};
