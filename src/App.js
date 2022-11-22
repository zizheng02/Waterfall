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
  const [column, setColumn] = useState(4);
  const subColumn=()=>{
    setColumn(pre => pre - 1);
  }
  const addColumn = ()=>{
    setColumn(pre => pre+1)
  }
  function debounce(fun,time){
     let timer
     return function(){
       clearTimeout(timer)
       let args = arguments
       timer=setTimeout(()=>{
         fun.apply(this,args)
       },time)
     }
   }
  return (
    <div id="container">
      <button onClick={subColumn}> - </button>
      <button onClick={addColumn}> + </button>
      <Waterfall imgUrl={testImgUrl} imgWidth={150} column={column}  gapX={10} gapY={10} type={'single'}/>
      <button onClick={debounce(()=>console.log("hello"),500)}>AddOne</button>
    </div>
  );
}

export default App;
