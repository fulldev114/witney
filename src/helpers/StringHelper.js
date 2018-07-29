const StringHelper = {

  /**
   * Example: extract "Chacha" from "01__Chacha"
   */
  getCategoryTitle: (str: string) => {
    const strSplit = str.split('__');
    return strSplit[strSplit.length - 1];
  },
  replaceAll: (str, mapObj) => {
    const regex = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    return str.replace(regex, matched => mapObj[matched]);
  },
  toUpperCase: value => (value ? value.toUpperCase() : ''),
  toLowerCase: value => (value ? value.toLowerCase() : ''),
  toCapitalize: value => (value ? value.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : ''),
};

export default StringHelper;
