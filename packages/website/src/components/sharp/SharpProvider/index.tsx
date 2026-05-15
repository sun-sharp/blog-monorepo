import { ConfigProvider } from 'antd';
import { Locale } from 'antd/es/locale';
import { PropsWithChildren, useState } from 'react';
import zhCN from 'antd/locale/zh_CN';
import SharpProviderMessage from '../SharpProviderMessage';

const SharpProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [locale] = useState<Locale>(zhCN);
  return (
    <ConfigProvider locale={locale}>
      <SharpProviderMessage>{children}</SharpProviderMessage>
    </ConfigProvider>
  );
};

export default SharpProvider;
