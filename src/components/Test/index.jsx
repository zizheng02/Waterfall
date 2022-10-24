import React,{useState, useEffect, useReducer} from 'react';

const Test=()=>{
    let arr2 = [[1],[2]]
    const [arr,setArr]=useState(arr2)
    const handleClick=()=>{
        let curArr = JSON.parse(JSON.stringify(arr));
        curArr[0][0]=4
        setArr(curArr)
        console.log(curArr)
    }
    return(
        <h1 onClick={handleClick}>
            <h1>Test</h1>
            <TestItem count={arr[0][0]}/>
        </h1>
    )
}

const TestItem=(props)=>{
    console.log(props)
    return(
        
        <h1>TestItm {props.count}</h1>
    )
}

export {Test};