import React, { useState, useEffect, useReducer } from 'react';

const testImgUrl = [
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

// export interface IWaterfallTestProps {
//   imgUrl?: string[]; // 图片url数组
//   imgWidth?: number; // 图片宽度
//   height?: number; // 瀑布流容器可视区域高度
//   column?: number; // 列数
//   gapX?: number; // 行间距（同列图片上下间距）
//   gapY?: number; //列间距
//   type?: 'single' | 'multiple'; // 类型（单选/多选，单选至多选择1个，多选相当于不限制）
//   // onImgClick?: (imgIndex: number, imgUrl: string) => void; // 图片的点击事件回调
//   onReachBottom?: (currentPage) => void; // 滚动至容器底部的回调
// }

export const Waterfall = ({
  imgUrl = testImgUrl,
  imgWidth = 114,
  height,
  column = 2,
  gapX = 12,
  gapY = 12,
  type = 'multiple',
  // onImgClick,
//   onReachBottom,
}) => {
  const arr = [];
  const typeArr = [];
  for (let i = 0; i < column; i++) {
    arr.push([]);
    typeArr.push([]);
  }
  const [singleCheckedID, setSingleCheckedID] = useState('')
  const [dataList, setDataList] = useState([]);
  // allColumn里的数据添加到页面上了没
  const [isMount, setIsMount] = useState(false);
  const [isDataFetch, setIsDataFetch] = useState(false);
  const [allColumnData, setAllColumnData] = useState(arr);
  // 0: 未选中  1: 选中
  const [allColumnType, setAllColumnType] = useState(typeArr);
  const [dataIndex, setDataIndex] = useState(column);
  // 为了强制更新
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const getData = () => {
    // 向后端请求数据
    return testImgUrl;
  };
  // 挂载和第一次渲染
  useEffect(() => {
    const data = getData();
    setDataList(data);
  }, []);
  // 数据变化时重新渲染
  useEffect(() => {
    // 仅第一次初始化
    if (dataList.length > 0 && isDataFetch === false) {
      initFirstRow();
    }
  }, [dataList]);
  const initFirstRow = () => {
    const curData = allColumnData;
    const curTypeArr = allColumnType;
    for (let i = 0; i < dataList.length && i < column; i++) {
      curData[i].push(dataList[i]);
      curTypeArr[i].push(0);
    }
    setAllColumnData(curData);
    setAllColumnType(curTypeArr);
    // 此处需要执行强制刷新
    forceUpdate();
    setIsMount(prevState => !prevState);
  };
  useEffect(() => {
    // 初始化时跳过
    if (dataList.length > 0) {
      addPicture();
    }
  }, [isMount]);
  const addPicture = () => {
    if (dataIndex >= dataList.length) {
      console.log('图片已加载完成一次');
      setIsDataFetch(true);
      const data = getData();
      const newDataList = [...dataList, ...data];
      setDataList(newDataList);
    }
    const columnArray = document.querySelectorAll('.waterfall_column');
    const eleHeight = [];
    for (let i = 0; i < columnArray.length; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eleHeight.push(columnArray[i].offsetHeight);
    }
    // 每次找出最小的
    const minEle = Math.min(...eleHeight);
    const index = eleHeight.indexOf(minEle);
    // 然后把下一个data元素添加在上面高度最矮的这一列里
    const curData = allColumnData;
    curData[index].push(dataList[dataIndex]);
    const curTypeArr = allColumnType;
    curTypeArr[index].push(0);
    setDataIndex(n => n + 1);
    setAllColumnData(curData);
    setAllColumnType(curTypeArr);
    forceUpdate();
    startObserve(index);
  };
  const startObserve = (index) => {
    const columnArray = document.querySelectorAll('.waterfall_column')[index].querySelectorAll('.waterfall_column_ele');
    // 瀑布流布局：取出数据源中最靠前的一个并添加到瀑布流高度最小的那一列，等图片完全加载后重复该循环
    const observerObj = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { target, isIntersecting } = entry;
          if (isIntersecting) {
            observerObj.unobserve(target);
            setIsMount((prevState) => !prevState);
          }
        }
      },
      {
        // 用来控制触底多少，开始回调
        rootMargin: '0px 0px 20px 0px',
      }
    );
    observerObj.observe(columnArray[columnArray.length - 1]);
  };
  const onImgClick = (event) => {
    const targetId = event.target.parentNode.id;
    const idArr = targetId.split('_');
    // 不触发响应,用深层拷贝
    const curTypeArr = JSON.parse(JSON.stringify(allColumnType));
    if (type === 'single') {
      if (singleCheckedID === targetId) {
        // 取消上次单选的元素
        const preIdArr = targetId.split('_')
        curTypeArr[preIdArr[0]][preIdArr[1]] = 1 - curTypeArr[preIdArr[0]][preIdArr[1]];
      }
      setSingleCheckedID(targetId);
    }
    curTypeArr[idArr[0]][idArr[1]] = 1 - curTypeArr[idArr[0]][idArr[1]];
    setAllColumnType(curTypeArr);
  };
  const marginStyle1={
    marginTop: gapY
  }
  const marginStyle2={
    marginRight: gapX
  }
  const marginStyle3={
    marginTop: gapY,
    marginRight: gapX
  }
  return (
    <div>
      {/* 瀑布流容器的宽度直接改下面一行的 height 即可，未设置在 props 中 */}
      <div className={'waterfall_container'} style={{ overflowY: 'scroll', height: '300px' }}>
        {allColumnData.map((columnItem, index1) => (
          <div className={'waterfall_column'} key={index1} style={{ display: 'inline-block', verticalAlign: 'top' }}>
            {columnItem.map((curItem, index2) => (
              <div
                className={'waterfall_column_ele'}
                id={index1 + "_" + index2}
                key={index2}
                onClick={onImgClick}
                style={{marginRight: (index1 === (column - 1)) ? 0 : gapX, marginTop: (index2 === 0) ? 0 : gapX}}
              >
                <WaterfallItem url={curItem} width={imgWidth} checked={allColumnType[index1][index2]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const WaterfallItem = (props) => {
  const { url, width, checked } = props;
  const opacity = checked ? '0.4' : '0.8';
  const itemStyle = {
    width: width,
    display:"block",
    opacity,
  };
  return <img src={url} style={itemStyle}></img>;
};
