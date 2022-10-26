import React,{useState, useEffect, useReducer} from 'react';

const Waterfall =(props)=>{
     // 测试数据,应该做成一个API
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

    const {column = 4,imgWidth,gapX,gapY,type} = props
    // 生成二维数组
    let arr = [];
    let typeArr=[];
    for(let i=0;i<column;i++){
        arr.push([]);
        typeArr.push([]);
    }
    const [dataList, setDataList] = useState([]);
    // allColumn里的数据添加到页面上了没
    const [hasGet, setHasGet] = useState(false);
    // 记录单选被选中的元素
    const [singleIndex,setSingleIndex]=useState([-1,-1])
    // 记录多选被选中的元素
    const [allColumnType,setAllColumnType] = useState(typeArr)
    const [dataRefresh,setDataRefresh] = useState(false);
    const [allColumnData, setAllColumnData] = useState(arr);
    // 为了强制更新
    const [_,forceUpdate] = useReducer( x=> x+1,0);
    const [dataIndex, setDataIndex] = useState(column);
    // 获取数据
    const getData =() =>{
        // 这里向后端请求数据
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
            // console.log("init")
        }
    },[dataList]);
    const initFirstRow = () => {
        let curData = allColumnData;
        let curTypeArr = allColumnType;
        for (let i = 0; i < dataList.length && i < column; i++) {
            curData[i].push(dataList[i]);
            curTypeArr[i].push(0);
        }
        setAllColumnData(curData)
        setAllColumnType(curTypeArr)
        // 此处需要执行强制刷新
        forceUpdate()
        // 新加入list的数据还没放到页面上
        setHasGet(prevState => !prevState)
    }
    useEffect(() => {
        if (dataList.length > 0) {
            addPicture()
        }
    }, [hasGet])
    const addPicture = () => {
        if (dataIndex >= dataList.length) {
            console.log('图片已加载完成一次')
            setDataRefresh(true);
            let data = getData();
            let newDataList = [...dataList,...data]
            setDataList(newDataList);
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
        let curTypeArr = allColumnType;
        curTypeArr[index].push(0);
        setDataIndex(n => n + 1)
        setAllColumnData(curData)
        setAllColumnType(curTypeArr);
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
                // 用来控制触底多少时才开始回调
            rootMargin:"0px 0px 30px 0px"
            }
        )
        observerObj.observe(columnArray[columnArray.length - 1])
    }
    const onImgClick=(event)=>{
        const nodeId = event.target.parentNode.id
        let idArr = nodeId.split(',')
        // 不触发响应,用深层拷贝
        let curTypeArr = JSON.parse(JSON.stringify(allColumnType))
        if(type === 1){
            if(singleIndex[0]>=0){
                curTypeArr[singleIndex[0]][singleIndex[1]] = 1 -curTypeArr[singleIndex[0]][singleIndex[1]]
                console.log(curTypeArr[singleIndex[0]][singleIndex[1]])
            }
            setSingleIndex(idArr)
        }
        curTypeArr[idArr[0]][idArr[1]] = 1 - curTypeArr[idArr[0]][idArr[1]];
        setAllColumnType(curTypeArr);
       
    }
    let marginStyle = {
        marginBottom:gapY,
        marginLeft: gapX/2,
        marginRight: gapX/2
    }
    return (
        <div>
            {/* 瀑布流容器的宽度直接改下面一行的 height 即可，未设置在 props 中 */}
            <div className={'flex-row'} style={{overflowY:"scroll",height:"300px"}}>
                {
                    allColumnData.map((item, index1) => (
                        <div className={'flex-column'} key={index1} style={{display:"inline-block",verticalAlign:"top"}}>
                            {
                                item.map((curItem,index2) => (
                                    <div className={'flex-column-ele'} id={[index1,index2]} key={index2}  onClick={onImgClick} style={marginStyle}>
                                        <WaterfallItem url={curItem} width={imgWidth} checked={allColumnType[index1][index2]}/>
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
    const {url, width,checked} = props;
    // console.log(props)
    let opacity = checked ? "1" : "0.6";
    const itemStyle={
        width:width,
        opacity
    }
    return(
        <img src={url} style={itemStyle} id={checked}></img>
    )
}

export {Waterfall};