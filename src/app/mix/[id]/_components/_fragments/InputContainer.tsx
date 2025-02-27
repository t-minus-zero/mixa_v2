"use client"

// Define props interface for the container
interface InputContainerProps {
  children: React.ReactNode; // Child components to render inside the container
  label: string; // Label text to display above the input
  // Optional props like buttons and their callback functions
}

// Container component that provides consistent styling and layout
export default function InputContainer({ children, label }: InputContainerProps) {

  return (
    <div className="inline-block">
      <div className="flex flex-row items-center justify-between gap-4 pb-1">
        <h5 className="text-xs text-zinc-500">{label}</h5>
        <div className="flex flex-row items-center gap-4">
          {/* Optional buttons with their callback functions */}
          <button className="text-xs text-zinc-500">Auto</button>
        </div>
      </div>
      <div
        className="
          bg-gray-100 
          rounded-md 
          p-2 
          flex 
          items-center
          border
          border-transparent
          hover:border-gray-300 
          focus-within:border-blue-300 
          focus-within:hover:border-blue-300 
          transition 
          duration-150
        "
      >
        {children}
      </div>
    </div>
  );
}
