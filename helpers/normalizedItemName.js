export const normalizedItemName = ( itemName ) => {
    return itemName.normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .trim();
};