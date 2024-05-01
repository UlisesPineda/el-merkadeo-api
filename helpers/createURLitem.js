export const createURLitem = ( item ) => {
    let urlItem;
    urlItem = item.trim().replace(/\s+/g, '-').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    return urlItem;
};