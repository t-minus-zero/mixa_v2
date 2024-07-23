"use client";

import { useState } from 'react';
import DropDown from './Dropdown';
import { inputStyle } from '../_styles/styles';

const InputDropAndText = ({ id, initValue, listOfValues }:{ id:any, initValue:any, listOfValues:Array<any> }) =>{

    const [mode, setMode] = useState('rest'); // rest, dropdown, typing
    const [value, setValue] = useState(initValue);

    return (
        <div 
            className="relative flex items-center justify-center w-12 border-box text-xs"
            style={{...inputStyle, borderColor: mode !== 'rest' ? 'rgba(2,132,199,1)' : 'rgba(2,132,199,0)'}}
        >
            {mode !== 'typing' &&
                <div
                    className="relative select-none">
                    <span onClick={(e) => {e.preventDefault; mode === "rest" ? setMode('dropdown') : setMode('typing')}} > {value} </span>
                    { mode === 'dropdown' && 
                        <div
                            style={{left:0, top: '100%', width: '100%'} }	
                            className='absolute w-full flex items-center justify-center'
                        >
                            <DropDown setMode = {setMode} setValue = {setValue} value={value} listOfValues={listOfValues} />
                        </div>
                    }
                </div> 
            }
            {mode === 'typing' &&
                <input 
                    style={{...inputStyle, width: value.length + 'ch'}}
                    value = {value}
                    autoFocus
                    onChange = {(e) => setValue(e.target.value)}
                    onBlur={() => setMode('rest')} 
                />
            }
        </div>
    )
}

export default InputDropAndText;