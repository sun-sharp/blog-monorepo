import { message } from 'antd';
import { PropsWithChildren } from 'react';

const SharpProviderMessage: React.FC<PropsWithChildren> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();
  //挂载在 window 方便与在js中使用
  const sharpWindow: SharpWindow = window;
  sharpWindow['$message'] = messageApi;
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default SharpProviderMessage;
