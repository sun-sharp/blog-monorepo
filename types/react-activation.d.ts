declare module 'react-activation' {
  import { ComponentType, ReactNode, Component } from 'react';

  interface KeepAliveProps {
    name?: string;
    when?: boolean | (() => boolean);
    saveScrollPosition?: boolean;
    children?: ReactNode;
  }

  export class KeepAlive extends Component<KeepAliveProps> {}

  interface AliveScopeProps {
    children?: ReactNode;
  }

  export class AliveScope extends Component<AliveScopeProps> {}

  export function useAliveController(): {
    drop: (name: string) => void;
    refresh: (name: string) => void;
    getCachingNodes: () => Array<{ name: string }>;
  };
}
