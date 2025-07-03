"use client"

import React, {RefObject} from 'react';

interface FloaterContainerProps {
  children: React.ReactNode;
  anchor: string;
  ref: RefObject<HTMLDivElement>;
}

export default function FloaterContainer({ children, anchor, ref }: FloaterContainerProps) {

  return (
    <div className={'absolute flex flex-col items-center z-20 ' + anchor }>
        <div ref={ref} className='h-full w-full w-64 flex flex-col rounded-3xl shadow-2xl overflow-hidden justify-between items-end group/tree'>
          {children}
        </div>
    </div>
  );
}