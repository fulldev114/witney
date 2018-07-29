const ValidationHelper = {
  validateEmail: (email) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
      return true;
    }
    return false;
  },
  validateRequired: value => (value !== null && value.length > 0),
  validateMinLength: (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  },
};

export default ValidationHelper;
