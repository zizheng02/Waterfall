import React, { useState, useEffect, useReducer } from 'react';
import { Image } from '@arco-design/web-react';
import "./index.css"; 

export const Waterfall = (props) => {
  const {imgUrl, imgWidth, column, gapX, gapY, type} = props

  // 初始化
  const arr = [];
  const typeArr = [];
  for(let i = 0;i<column;i++){
    arr.push([])
    typeArr.push([])
  }
  const [curColumn,setCurColumn]= useState(column)
  const [singleCheckedID, setSingleCheckedID] = useState('')
  const [dataList, setDataList] = useState([]);
  // 并不表示什么，交替触发
  const [isMount, setIsMount] = useState(false);
  const [allColumnData, setAllColumnData] = useState(arr);
  // 0: 未选中  1: 选中
  const [allColumnType, setAllColumnType] = useState(typeArr);
  const [dataIndex, setDataIndex] = useState(column);
  // 为了强制更新（不是很懂？）
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const getData = () => {
    // 
    // 
    // Todo: 这里向后端请求数据！
    // 
    // 
    return imgUrl;
  };
  useEffect(()=>{
    console.log(column);
    if(column !== curColumn){
      console.log('column change');
      setDataList([]);
      setAllColumnData(arr)
      setAllColumnType(typeArr)
      setCurColumn(column)
      setDataIndex(column)
      setSingleCheckedID('')
    }
  },[column])
  // 挂载和第一次渲染，React18会在第一次加载时执行两遍
  useEffect(() => {
    const data = getData();
    setDataList(data);
    // console.log('init')
  }, [column]);
  // 第一次放入数据后做些处理
  useEffect(() => {
    if (dataList.length > 0 && dataIndex === column) {
      initFirstRow();
      // 这里在初始化的时候只会触发一次
      // console.log('initRow')
    }
    console.log('data change')
    if(dataIndex + 1 < dataList.length && dataIndex !== column){
      addPicture();
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
    // console.log('init add ',dataList.length);
    // 初始化时跳过,跳过了两次
    if (dataList.length > 0 ) {
      addPicture();
      // console.log(isMount)
    }
  }, [isMount]);
  const addPicture = () => {
    if (dataIndex >= dataList.length) {
      console.log('图片已加载完成一次');
      const newdata = getData();
      const newDataList = [...dataList, ...newdata]
      // console.log(newDataList)
      setDataList( (dataList)=>[...dataList, ...newdata]);
      // 这里没有更新
      // console.log('length: ',dataList.length);
      return;
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
    // console.log('change dataindex: ',dataList.length,dataIndex)
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
          // console.log(entry);
          if (isIntersecting) {
            observerObj.unobserve(target);
            setIsMount((prevState) => !prevState);
            // console.log('add: ',dataIndex);
          }
        }
      },
    );
    observerObj.observe(columnArray[columnArray.length - 1]);
  };

  // 
  // 图片的点击事件
  // 
  // const onImgClick = (event) => {
  //   const targetId = event.target.parentNode.id;
  //   const idArr = targetId.split('_');
  //   // 不触发响应,用深层拷贝
  //   const curTypeArr = JSON.parse(JSON.stringify(allColumnType));
  //   if (type === 'single') {
  //     if (singleCheckedID!=='' && singleCheckedID !== targetId) {
  //       // 取消上次单选的元素
  //       const preIdArr = singleCheckedID.split('_')
  //       curTypeArr[preIdArr[0]][preIdArr[1]] = 1 - curTypeArr[preIdArr[0]][preIdArr[1]];
  //     }
  //     setSingleCheckedID(targetId);
  //   }
  //   curTypeArr[idArr[0]][idArr[1]] = 1 - curTypeArr[idArr[0]][idArr[1]];
  //   setAllColumnType(curTypeArr);
  // };
  return (
    <div>
      {/* 瀑布流容器的宽度直接改下面一行的 height 即可，可设置为 API  */}
      <div className={'waterfall_container'} style={{ overflowY: 'scroll', height: '300px' }}>
        {allColumnData.map((columnItem, index1) => (
          <div className={'waterfall_column'} key={index1} style={{ display: 'inline-block', verticalAlign: 'top' }}>
            {columnItem.map((curItem, index2) => (
              <div
                className={'waterfall_column_ele'}
                id={index1 + "_" + index2}
                key={index2}
                // onClick={onImgClick}
                style={{marginRight: (index1 === (column - 1)) ? 0 : gapX, marginTop: (index2 === 0) ? 0 : gapY}}
              >
                <WaterfallItem url={curItem} width={imgWidth} checked={allColumnType[index1][index2]}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const WaterfallItem = (props) => {
  const { url, width, checked} = props;
  const opacity = checked ? '0.5' : '1';

  const itemStyle = {
    width: width,
    display:"block",
    maxWidth: "100%",
    maxHeight:"100%",
    opacity,
  };
  // return <img src={url} style={itemStyle} alt="loading fail"/>;

  // 
  // Arco Design Image Component
  // 它的style接口应该只支持字符串（一个表达inline CSS的字符串）
  // 
  return(
    <Image
    className="imgItem"
    src={url}
    style={itemStyle}
    alt="loading failed!"
    preview={false}
    />
  )
};
