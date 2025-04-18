"use client";

import { useState, useEffect } from 'react';

// Inline styles previously imported from _styles/styles.tsx
const inputStyle = {
    minWidth: 'none',
    width: 'auto',
    background: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    transition: 'all 0s ease-in-out',
};

const InputClickAndText = ({ id, initValue, updateValue }:{ id:any, initValue:any, updateValue:Function }) =>{
    const [mode, setMode] = useState('rest'); // rest, typing
    const [value, setValue] = useState(initValue);

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    return(
        <div 
            className="relative flex items-center justify-center w-12 border-box"
            style={{...inputStyle, borderColor: mode !== 'rest' ? 'rgba(2,132,199,1)' : 'rgba(2,132,199,0)'}}
        >
            {mode !== 'typing' &&
                <div
                    className="relative select-none">
                    <span onDoubleClick={(e) => {e.preventDefault; setMode('typing');}} > {value} </span>
                </div> 
            }
            {mode === 'typing' &&
                <input 
                    style={{...inputStyle, width: initValue.length + 'ch'}}
                    value = {value}
                    autoFocus
                    onChange = {(e) => setValue(e.target.value)}
                    onBlur={() => {setMode('rest'), updateValue(value)}} 
                />
            }
        </div>
    );
}

export default InputClickAndText;