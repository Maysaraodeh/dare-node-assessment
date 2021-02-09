import propertiesReader from 'properties-reader';

const properties = propertiesReader('./assets/properties.txt');

const property = (key) => properties.get(key);

export default property;
