import { ConfigProvider } from 'antd';
import { Locale } from 'antd/es/locale';
import { PropsWithChildren, useState } from 'react';
import zhCN from 'antd/locale/zh_CN';

const SharpProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [locale] = useState<Locale>(zhCN);
  return (
    <>
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </>
  );
};

export default SharpProvider;
