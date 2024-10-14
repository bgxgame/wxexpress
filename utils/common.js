module.exports.removeEmptyValues = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== "" && obj[key] !== undefined && obj[key] !== null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
