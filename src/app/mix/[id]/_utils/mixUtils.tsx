
import { v4 as uuidv4 } from 'uuid';
import { CssClass, TreeNode } from '../_types/types';

// Define interfaces for type safety
export interface MixJsonContent {
  version: number;
  treeData: any;
  cssData: any;
}

export const latestFormatVersion = 2.1;


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
            return convertV1_0To2_1(mixJsonContent);
        case 2.0 :
            return convertV2_0To2_1(mixJsonContent);
        default:
            return mixJsonContent;
    }

};



// --- Conversion from V1.0 to V2.1 ---

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

export const convertV1_0To2_1 = (mixJsonContent: MixJsonContent): MixJsonContent => {
    
    console.log(' ---> CONVERTING mix data from version 1.0 to 2.1');
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
          id: uuidv4(),
          name: oldClass.name,
          properties: oldClass.properties || [],
          categories: [] // Add empty categories array for V2.1
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
      version: 2.1,
      treeData: newTreeData,
      cssData: updatedCssData
    };
  };

// --- Conversion from V2.0 to V2.1 ---

// Convert V2.0 to V2.1: Add categories array to classes and category property support
export const convertV2_0To2_1 = (mixJsonContent: MixJsonContent): MixJsonContent => {
  console.log('Converting from V2.0 to V2.1...');
  
  const cssData = mixJsonContent.cssData;
  
  // Add categories array to each class if it doesn't exist
  if (cssData && cssData.classes) {
    cssData.classes = cssData.classes.map((cssClass: CssClass) => ({
      ...cssClass,
      categories: cssClass.categories || [] // Add empty categories array if missing
    }));
  }
  
  console.log('Conversion to V2.1 complete');
  
  return {
    version: 2.1,
    treeData: mixJsonContent.treeData,
    cssData: cssData
  };
};