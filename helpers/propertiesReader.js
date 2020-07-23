import propertiesReader from 'properties-reader';

const properties = propertiesReader('./assets/properties.txt');

export const property = (key) => properties.get(key);
