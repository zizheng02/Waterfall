import './App.css'
import { Waterfall } from './components/Waterfall/index.jsx';

function App() {
  // 测试数据
  let testImgUrl = [
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
  ];
  return (
    <div id="container">
      <Waterfall imgUrl={testImgUrl} imgWidth={150} column={3}  gapX={10} gapY={10} type={'single'}/>
    </div>
  );
}

export default App;
