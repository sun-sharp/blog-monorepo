import LoveIcon from '@/components/icon/LoveIcon';
import { VITE_APP_SHORT_NAME } from '@/constants';
import { Footer } from 'antd/es/layout/layout';
import { differenceInSeconds, getYear } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

const LayoutFooter: React.FC = () => {
  // 获取相差时间
  const formatDateDiff = () => {
    const diffSec = differenceInSeconds(new Date(), new Date('2020-01-01 00:00:00'));
    const day = Math.floor(diffSec / (60 * 60 * 24));
    const hour = Math.floor((diffSec - day * (60 * 60 * 24)) / (60 * 60));
    const min = Math.floor((diffSec - day * (60 * 60 * 24) - hour * (60 * 60)) / 60);
    const sec = diffSec - day * (60 * 60 * 24) - hour * (60 * 60) - min * 60;
    return `${day} 天 ${hour} 小时 ${min} 分 ${sec} 秒`;
  };
  const [runDate, setRunDate] = useState(formatDateDiff());

  // 当前年份
  const [nowYear] = useState(getYear(new Date()));

  // 定时器
  const intervalRef = useRef<NodeJS.Timeout | number>(0);
  useEffect(() => {
    // 这里的代码块 等价于 componentDidMount
    // do something...
    intervalRef.current = setTimeout(() => {
      setRunDate(formatDateDiff());
    }, 1000);
    // return的写法 等价于 componentWillUnmount
    return () => {
      // do something...
      clearInterval(intervalRef.current);
    };
  });

  return (
    <>
      <Footer className="layout-footer">
        <div>
          ©2020 – {nowYear}
          <LoveIcon className="layout-footer--love" />
          <span> {VITE_APP_SHORT_NAME} | </span>
          <a className="layout-footer--to" href="https://beian.miit.gov.cn">
            黔ICP备2021008571号
          </a>
        </div>
        <div className="w-full mt-6">本站已安全运行 {runDate}</div>
        {/* <div className="w-full mt-6">24811 人 | asdhakjshjk</div> */}
      </Footer>
    </>
  );
};

export default LayoutFooter;
