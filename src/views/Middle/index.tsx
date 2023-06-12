import { Link } from 'react-router-dom';
import './index.scss';
import headSculpture from '@/assets/head_sculpture.jpg';
import { useEffect } from 'react';
import { fallenLeavesAnimation } from '@/plugins/canvas/fallen-leaves';

const Middle: React.FC = () => {
  useEffect(() => {
    // 这里的代码块 等价于 componentDidMount
    // do something...
    fallenLeavesAnimation();
    // return的写法 等价于 componentWillUnmount
    return () => {
      // do something...
    };
  });
  return (
    <>
      <div className="middle">
        <canvas id="fallenLeaves" />
        <div className="content">
          <div className="middle-header">
            <Link className="link" to={`/`}>
              <img className="middle-logo" src={headSculpture} alt="Yang Ruirui logo" />
            </Link>
          </div>
          <div className="middle-body">
            <div className="list">
              <Link className="link" to={`/`}>
                官网
              </Link>
              {/*<Link className="link" to={`/project`}>*/}
              {/*  项目*/}
              {/*</Link>*/}
              <a target="_blank" rel="noopener noreferrer" className="link" href={`http://www.yangruirui.top/manage`}>
                后台管理系统
              </a>
              <a target="_blank" rel="noopener noreferrer" className="link" href={`https://github.com/sun-sharp`}>
                github
              </a>
              {/* <a */}
              {/*  target="_blank"*/}
              {/*  rel="noopener noreferrer"*/}
              {/*  className="link"*/}
              {/*  href={`https://juejin.im/user/591d6b4d0ce463006926ae40`}*/}
              {/*>*/}
              {/*  掘金*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  target="_blank"*/}
              {/*  rel="noopener noreferrer"*/}
              {/*  className="link"*/}
              {/*  href={`https://www.zhihu.com/people/gu-jian-qi-tan-shui/activities`}*/}
              {/*>*/}
              {/*  知乎*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  target="_blank"*/}
              {/*  rel="noopener noreferrer"*/}
              {/*  className="link"*/}
              {/*  href={`https://segmentfault.com/u/biaochenxuying`}*/}
              {/*>*/}
              {/*  segmentFault*/}
              {/*</a>*/}
              {/*<a*/}
              {/*  target="_blank"*/}
              {/*  rel="noopener noreferrer"*/}
              {/*  className="link"*/}
              {/*  href={`https://www.jianshu.com/u/91717b553bfd`}*/}
              {/*>*/}
              {/*  简书*/}
              {/*</a>*/}
            </div>
            {/* <div className="logion"> 加班到天明，学习到昏厥 ！！！ </div>*/}
            {/*<div className="introduce"> 时光正好，未来可期，加油 ！ </div>*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default Middle;
