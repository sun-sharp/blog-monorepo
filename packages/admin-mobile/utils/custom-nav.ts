export function getCustomNavHeight(): number {
  const systemInfo = uni.getSystemInfoSync();
  const statusBarHeight = systemInfo.statusBarHeight || 0;

  try {
    const menuButton = uni.getMenuButtonBoundingClientRect();
    if (menuButton && menuButton.bottom && menuButton.top) {
      return menuButton.bottom + (menuButton.top - statusBarHeight);
    }
  } catch {}

  return statusBarHeight;
}
