const RequestHelper = {
  serialize: (params) => {
    const str = [];
    if (!params) return '';
    Object.keys(params).forEach((key) => {
      const value = params[key];
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    return str.join('&');
  },
};

export default RequestHelper;
