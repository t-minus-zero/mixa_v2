
import { v4 as uuidv4 } from 'uuid';
import { CssClass } from '../_types/types';

// Define interfaces for type safety
export interface MixJsonContent {
  version: number;
  treeData: any;
  cssData: any;
}

export const latestFormatVersion = 2.0;


export const loadMixData = (mixJsonContent: MixJsonContent): { version: number; treeData: any; cssData: any } => {

    const mixData = mixJsonContent;

    if (!mixData.version) {
        mixData.version = 1.0;
    }

    if (mixData.version < latestFormatVersion) {
        const updatedData = updateMixData(mixData);
        return loadMixData(updatedData);
    }

    return mixData;
};

export const updateMixData = (mixJsonContent: MixJsonContent): MixJsonContent => {
    
    switch (mixJsonContent.version) {
        case 1.0 :
            return convertV1_0To2_0(mixJsonContent);
        default:
            return mixJsonContent;
    }

};



// --- Conversion fo V1.0 to V2.0 ---

export const updateTreeClasses = (node: TreeNode, newClasses: CssClass[]) => {
    for (const className of node.classes) {
        const newClassName = newClasses.find(cls => cls.name === className)?.id;
        if (newClassName) {
            node.classes = node.classes.map(cls => cls === className ? newClassName : cls);
        }
    }
    if (node.childrens) {
        for (const child of node.childrens) {
            updateTreeClasses(child, newClasses);
        }
    }
    return node;
  };

export const convertV1_0To2_0 = (mixJsonContent: MixJsonContent): MixJsonContent => {
    
    console.log(' ---> CONVERTING mix data from version 1.0 to 2.0');
    const {treeData, cssData} = mixJsonContent;
    
    // Create a new array to hold the converted classes
    const newClasses: CssClass[] = [];
    
    // Convert each class in the old format to the new format
    const oldClasses = cssData?.classes || {};
    
    for (const className in oldClasses) {
      const oldClass = oldClasses[className];
      
      if (oldClass) {
        // Create a new class with an ID
        // Use the key from the old classes object as the name of the new class
        const newClass: CssClass = {
          id: uuidv4().substring(0, 8), // Always generate a new ID with max 8 characters
          name: oldClass.name, // Use className if string, otherwise try oldClass.className
          properties: oldClass.properties || []
        };
        
        newClasses.push(newClass);
      }
    }

    const newTreeData = updateTreeClasses(treeData, newClasses);

    // Return the updated mix with version 2.0
    // Create a new cssData with classes as an array instead of an object
    const updatedCssData = {
      ...cssData,
      classes: newClasses // Replace the classes object with the array
    };
    
    return {
      version: 2.0,
      treeData: newTreeData,
      cssData: updatedCssData
    };
  };