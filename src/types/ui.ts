import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';

export type AppSpeedDialLayer = 'content' | 'header';

export type AppSpeedDialAction = {
  id: string;
  label: string;
  icon: ReactNode;
  to?: string;
  href?: string;
  download?: string | boolean;
  external?: boolean;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
};

export type TabPanelRenderContext = {
  getDrawerContainer: () => HTMLDivElement | null;
  panelId: string;
  tabId?: string;
  dense: boolean;
  hasTabs: boolean;
};

export type TabPanelItem = {
  value: string;
  label: string;
  shortLabel?: string;
  content?: ReactNode;
  renderContent?: (selected: boolean, context: TabPanelRenderContext) => ReactNode;
  closeDelayMs?: number;
  disabled?: boolean;
};

export type WebVitalEntry = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
};

export type WebVitalsState = {
  metrics: Map<string, WebVitalEntry>;
  collected: boolean;
};

export interface TerminalLine {
  command: string;
  output: string;
}
