"use client"

import { useState } from 'react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import InputWrapper from '../_fragments/InputWrapper';
import TextInput from '../_fragments/TextInput';
import SelectInput from '../_fragments/SelectInput';
import NumberInput from '../_fragments/NumberInput';
import StructureSelector from './StructureSelector';

// Direct imports of the schemas
import { cssInputTypes } from './cssPropertySchemas/inputTypesSchema';
import { cssGridSchema } from './cssPropertySchemas/gridSchema';

interface PropertySectionProps {
  label: string;
  group?: string;
  properties?: Record<string, any>;
  values?: Record<string, string>;
  onChange?: (property: string, value: string) => void;
}

export default function PropertySection({
    label,
    group,
    properties = {},
    values = {},
    onChange = () => {}
}: PropertySectionProps) {
    const [open, setOpen] = useState(false);

    return (
        <AccordionWrapper open={open} onClick={() => setOpen(!open)}>
            <div className="flex flex-col items-center justify-center gap-4">
                <h3>{label}</h3>
                {/* Basic content here */}
            </div>
        </AccordionWrapper>
    )
}
