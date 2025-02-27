"use client"

type StructureType = 'single' | 'dual' | 'individual';

interface StructureSelectorProps {
  definition: {
    structures: Record<string, boolean>;
  };
  currentStructure: StructureType;
  onStructureChange: (structure: StructureType) => void;
}

export default function StructureSelector({
  definition,
  currentStructure,
  onStructureChange
}: StructureSelectorProps) {
  const { structures } = definition;

  return (
    <div className="inline-flex text-xs">
      {structures.single && (
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
      {structures.dual && (
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
      {structures.individual && (
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
