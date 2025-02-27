"use client"

type StructureType = 'single' | 'dual' | 'individual';

interface StructureSelectorProps {
  availableStructures: string[];
  currentStructure: StructureType;
  onStructureChange: (structure: StructureType) => void;
}

export default function StructureSelector({
  availableStructures,
  currentStructure,
  onStructureChange
}: StructureSelectorProps) {
  return (
    <div className="inline-flex text-xs">
      {availableStructures.includes('single') && (
        <button
          className={`
            px-1
            ${currentStructure === 'single' 
              ? 'text-gray-800 font-medium' 
              : 'text-gray-400 hover:text-gray-500'
            }
          `}
          onClick={() => onStructureChange('single')}
        >
          All
        </button>
      )}
      {availableStructures.includes('dual') && (
        <button
          className={`
            px-1
            ${currentStructure === 'dual'
              ? 'text-gray-800 font-medium'
              : 'text-gray-400 hover:text-gray-500'
            }
          `}
          onClick={() => onStructureChange('dual')}
        >
          2 Sides
        </button>
      )}
      {availableStructures.includes('individual') && (
        <button
          className={`
            px-1
            ${currentStructure === 'individual'
              ? 'text-gray-800 font-medium'
              : 'text-gray-400 hover:text-gray-500'
            }
          `}
          onClick={() => onStructureChange('individual')}
        >
          4 Sides
        </button>
      )}
    </div>
  );
}
