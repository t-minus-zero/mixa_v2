"use client";

import { useState } from 'react';

const DropDown =({setMode, setValue, value, listOfValues}:{setMode:Function, setValue:Function, value:any, listOfValues:Array<any> }) => {

    return(
        <ul className="w-full flex flex-col items-center justify-center gap-1 pt-1 z-20 select-none gb-zinc-50">
            {
                listOfValues.map((listValue, index) => {
                    return(
                        <li key={index} onClick={()=>{setMode('rest'); setValue(listValue)}}>{listValue}</li>
                    );
                })
            }
        </ul>
    );
}

export default DropDown;