"use client"
/* This is the modal page */
export default function MixModal({
    params: {id: mixId},
  }:{
    params: {id: string};
  }) {
    return <div className="top-0 left-0 absolute text-xl text-zinc-700 p-16">{mixId}</div>;
  }