
import { Waterfall } from './components/Waterfall/index.jsx';

function App() {
  const testImgUrl = [
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/79d9dd5daf0baf6e.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
    'https://s3.bmp.ovh/imgs/2022/09/28/bb5a169871df9452.png',
    'https://s3.bmp.ovh/imgs/2022/09/28/7ac17aaedface0ad.jpg',
  ];
  return (
    <div style={{margin:"50px auto",border:"1px solid grey"}}>
      <Waterfall column={3} imgWidth={150} gapX={10} gapY={10} type={0}/>
    </div>
  );
}

export default App;
