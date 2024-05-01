import { normalizedItemName } from "./normalizedItemName.js";

export const normalizedColorArray = ( colorArray ) => {
    let colorNormalizedArray = [];
    for (const  color of colorArray) {
        const colorNormalized = normalizedItemName( color );    
        colorNormalizedArray = [...colorNormalizedArray, colorNormalized]
    };
    return colorNormalizedArray;        
};
