import { useState } from 'react';
import './App.css'
import { Waterfall } from './components/Waterfall/index.jsx';

function App() {
  // 测试数据
  let testImgUrl = [
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
  ];
  const [column, setColumn] = useState(3);
  const subColumn=()=>{
    setColumn(pre => pre - 1);
  }
  return (
    <div id="container">
      <button onClick={subColumn}>Column</button>
      <Waterfall imgUrl={testImgUrl} imgWidth={150} column={column}  gapX={10} gapY={10} type={'multi'}/>
    </div>
  );
}

export default App;
