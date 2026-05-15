/**
 * React 18 特性工具函数
 *
 * React 18 主要新特性：
 * 1. 自动批处理（Automatic Batching）- 默认启用
 * 2. 并发渲染（Concurrent Rendering）
 * 3. 过渡更新（Transitions）
 * 4. Suspense 增强
 */

import { useTransition, useDeferredValue, Suspense, startTransition } from 'react';

/**
 * 自定义 Hook - 使用过渡更新
 * 适用于不紧急的 UI 更新，如列表过滤、Tab 切换等
 *
 * @example
 * const [isPending, transition] = useTransitionHook();
 * transition(() => setQuery(input));
 */
export const useTransitionHook = () => {
  const [isPending, transition] = useTransition();
  return { isPending, transition };
};

/**
 * 自定义 Hook - 使用延迟值
 * 适用于需要延迟更新的场景，如搜索输入
 *
 * @example
 * const deferredQuery = useDeferredValueHook(query);
 */
export const useDeferredValueHook = <T,>(value: T): T => {
  return useDeferredValue(value);
};

/**
 * 批量更新工具函数
 * React 18 中自动批处理已默认启用，此函数用于显式标记过渡更新
 *
 * @example
 * startTransitionHook(() => {
 *   setFilter('some-value');
 * });
 */
export const startTransitionHook = (callback: () => void) => {
  startTransition(callback);
};

/**
 * Suspense 配置
 * 用于包裹异步加载的组件
 */
interface SuspenseFallbackProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SuspenseWrapper: React.FC<SuspenseFallbackProps> = ({ children, fallback = <div>Loading...</div> }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export { useTransition, useDeferredValue, Suspense, startTransition };
