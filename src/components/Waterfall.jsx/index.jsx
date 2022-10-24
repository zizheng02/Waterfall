import React,{useState, useEffect, useReducer} from 'react';

const Waterfall =(props)=>{
    // 默认值
    const {column = 4} = props
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
    const columnCount = column;
    // let arr = [];
    // for(let i=0;i<column;i++){
    //     arr.push([]);
    // }
    let arr = [[],[],[],[]]
    const [dataList, setDataList] = useState([]);
    // allColumn里的数据添加到页面上了没
    const [hasGet, setHasGet] = useState(false);
    const [dataRefresh,setDataRefresh] = useState(false);
    const [allColumnData, setAllColumnData] = useState(arr);
    // 为了强制更新
    const [_,forceUpdate] = useReducer( x=> x+1,0);
    const [dataIndex, setDataIndex] = useState(columnCount);
    // 获取数据
    const getData =() =>{
        return testImgUrl
    }
    // 挂载和第一次渲染
    useEffect(()=>{
        let data = getData();
        setDataList(data)
    },[]);
    // 数据变化时重新渲染
    useEffect(()=>{
        if(dataList.length>0 && dataRefresh === false){
            initFirstRow();
            console.log("init")
        }
        // else{
        //     console.log("数据更新了")
        // }
    },[dataList]);
    const initFirstRow = () => {
        let curData = allColumnData;
        for (let i = 0; i < dataList.length && i < columnCount; i++) {
            curData[i].push(dataList[i]);
        }
        setAllColumnData(curData)
        // 此处需要执行强制刷新
        forceUpdate()
        setHasGet(prevState => !prevState)
    }
    useEffect(() => {
        // 跳过页面初始化
        if (dataList.length > 0) {
            addPicture()
        }
    }, [hasGet])
    const addPicture = () => {
        if (dataIndex >= dataList.length) {
            // console.log('图片已加载完成一次')
            // console.log(allColumnData,dataIndex,dataList)
            // setDataRefresh(true);
            // let data = getData();
            // let newDataList = [...dataList,...data]
            // setDataList(newDataList);
            return
        }
        let columnArray = document.querySelectorAll('.flex-column');
        let eleHeight = [];
        for (let i = 0; i < columnArray.length; i++) {
            eleHeight.push(columnArray[i].offsetHeight)
        }
        // 每次找出最小的
        let minEle = Math.min(...eleHeight)
        let index = eleHeight.indexOf(minEle)
        // 然后把下一个data元素添加在上面高度最矮的这一列里
        let curData = allColumnData
        curData[index].push(dataList[dataIndex])
        setDataIndex(n => n + 1)
        setAllColumnData(curData)
        forceUpdate()
        startObserve(index)
    }
    const startObserve = (index) => {
        let columnArray = document.querySelectorAll('.flex-column')[index].querySelectorAll('.flex-column-ele');
        // 瀑布流布局：取出数据源中最靠前的一个并添加到瀑布流高度最小的那一列，等图片完全加载后重复该循环
        let observerObj = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const {target, isIntersecting} = entry
                    if (isIntersecting) {
                        observerObj.unobserve(target)
                        setHasGet(prevState => !prevState)
                    }
                }
            },
            {
            rootMargin:"0px 0px 30px 0px"
            }
        )
        observerObj.observe(columnArray[columnArray.length - 1])
    }
    return (
        <div>
            <div className={'flex-row'} style={{overflowY:"scroll",height:"300px",display:"float"}}>
                {
                    allColumnData.map((item, index) => (
                        <div className={'flex-column'} key={index} style={{display:"inline-block",margin:"10px 5px",verticalAlign:"top"}}>
                            {
                                item.map((curItem,index) => (
                                    <div className={'flex-column-ele'} key={index} style={{width:"100px"}}>
                                        <WaterfallItem url={curItem} width="100px"/>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>

        </div>
    );
} 

const WaterfallItem = (props)=>{
    const {url, width,gapX, gppY} = props;
    const [checked,setChecked]=useState(false);
    const onImgClick=(event)=>{
        event.target.style.boxShadow="5px 5px";
        setChecked(true);
    }
    const itemStyle={
        width:width
    }
    return(
        <img src={url} style={itemStyle} onClick={onImgClick}></img>
    )
}

export {Waterfall};