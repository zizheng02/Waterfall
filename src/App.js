import { Waterfall } from './components/Waterfall/index.jsx';
import {Test} from './components/Test/index.jsx';

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
    <div>
      {/* <Waterfall imgUrl={testImgUrl} imgwidth="100" columnCount="2" gapX="10" gapY="5px"/> */}
      <Waterfall type={0}/>
      {/* <Test></Test> */}
    </div>
  );
}

export default App;
