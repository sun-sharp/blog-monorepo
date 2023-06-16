import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import './index.scss';
import { Button } from 'antd';

const Home: React.FC = () => {
  const [count, setCount] = useState(0);

  // return (
  //   <>
  // <div>首页</div>
  //     <h1>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </h1>
  //     <div className="card">
  //       <Button type="primary" onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </Button>
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
  //   </>
  // );
  return (
    <div className="home">
      <h1>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </h1>
      <div className="card">
        <Button type="primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
};

export default Home;
