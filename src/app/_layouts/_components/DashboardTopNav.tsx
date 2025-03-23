"use client";

// We no longer need the context for data as it's now server-side
import Link from 'next/link';

const DashboardTopNav = ({ children }: { children: React.ReactNode }) => {
    // We'll rely on props instead of context for data

    return (
        <nav 
            style={{backgroundImage: "linear-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0.8))" }}
            className="relative w-full h-16 flex flex-row items-center justify-center px-4 backdrop-blur-md">
        <div
            style={{maxWidth: "1440px"}} 
            className="w-full h-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start flex-grow flex-shrink-0 basis-40">
                <div className="text-2xl text-zinc-900 font-bold cursor-pointer leading-5 -mt-1"> mixa </div>
                <ul className="flex flex-row items center justify-start">
                    <li className="flex flex-row items center justify-start">
                        <div className="flex flex-row items-center justify-start text-zinc-200 text-xl font-thin leading-5 px-2 select-none">
                            /
                        </div>
                        <div className="flex flex-row items-center justify-start">
                            <a className="flex flex-row items-center justify-start gap-2 cursor-pointer">  
                                <span className="flex flex-row items-center justify-center rounded-md font-bold text-sm text-zinc-50 bg-zinc-900 w-5 h-5 leading-5"> P </span>
                                <p className="flex flex-row items-center justify-start text-sm text-zinc-900 leading-5"> Personal </p>
                            </a>
                        </div>
                    </li>
                    <li className="flex flex-row items-center justify-start">
                        <div className="flex flex-row items center justify-start px-2 text-zinc-200 text-xl font-thin leading-5 px-2 select-none">
                            /
                        </div>
                        <div className="flex flex-row items-center justify-start">
                            <a className="flex flex-row items-center justify-start gap-2 cursor-pointer">  
                                <span className="flex flex-row items-center justify-center rounded-md font-bold text-sm text-zinc-50 bg-zinc-900 w-5 h-5 leading-5"> X </span>
                                <p className="flex flex-row items-center justify-start text-sm text-zinc-900 leading-5">Dashboard</p>
                            </a>
                        </div>
                    </li>
                    <li className="flex flex-row items-center justify-start">
                        <div className="flex flex-row items center justify-start px-2 text-zinc-200 text-xl font-thin leading-5 px-2 select-none">
                            /
                        </div>
                        <div className="flex flex-row items-center justify-start">
                            <Link href={`/mix`}  
                                //onClick={(e) => {e.preventDefault(); createPost.mutate( {name} )}} 
                                className="flex flex-row items-center justify-start py-2 px-4 rounded-full gap-2 border border-zinc-200">
                                <span className="flex flex-row items-center justify-center text-xl font-thin text-zinc-700 leading-5 -mt-0.5"> + </span>
                                <p className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5"> Create Mix </p>
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="flex flex-row items-center justify-center px-4 flex-grow-0 flex-shrink-1 basis-auto">
                {children}
            </div>
            
            <div className="flex flex-row items-center justify-end gap-4 flex-grow flex-shrink-0 basis-40">
                <ul className="flex flex-row items center justify-start gap-4">
                    <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
                        <button className="flex flex-row items-center justify-start py-2 px-4 bg-zinc-900 rounded-full">
                            <span className="text-zinc-50 font-semibold"> Go Pro </span>
                        </button>
                    </li>
                    <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
                        <a className="cursor-pointer"> Blog </a>
                    </li>
                    <li className="flex flex-row items-center justify-start text-sm text-zinc-700 leading-5">
                        <a className="cursor-pointer"> Docs </a>
                    </li>
                </ul>
                <div className="text-zinc-900 cursor-pointer leading-5">
                    <div className="flex flex-row items-center justify-start gap-2 border border-zinc-200 rounded-full">
                        <span className="pl-4 text-zinc-500"> &#9776; </span>
                        <span className="flex flex-row items-center justify-center rounded-full font-bold text-sm text-zinc-50 bg-zinc-900 w-10 h-10 leading-5"> O </span>
                    </div> 
                </div>
            </div>
        </div>
        </nav>
    );
  };

  export default DashboardTopNav;