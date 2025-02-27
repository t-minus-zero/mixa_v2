"use client"

interface InputWrapperProps {
  children: React.ReactNode;
  label?: string;
  isSubProperty?: boolean;
  headerContent?: React.ReactNode;
}

export default function InputWrapper({ 
  children, 
  label,
  isSubProperty = false,
  headerContent
}: InputWrapperProps) {
  return (
    <div className="inline-block w-full">
      <div className="flex flex-row items-center justify-between gap-4 pb-1">
        {label && (
          <h5 className={`text-xs ${isSubProperty ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
            {label}
          </h5>
        )}
        {headerContent}
      </div>
      <div className="
        bg-gray-100 
        rounded-md 
        py-1
        px-2
        flex 
        items-center
        border
        border-transparent
        hover:border-gray-300 
        focus-within:border-blue-300 
        focus-within:hover:border-blue-300 
        transition 
        duration-150
      ">
        {children}
      </div>
    </div>
  );
}
