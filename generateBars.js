const bars = require('bars');

module.exports = (dataArray = [], width = 20, bar = '=', sort = false) => {
  const data = dataArray.reduce(
    (a, b) => Object.assign(a, { [b[0]]: b[1] }),
    {}
  );
  console.log(data);
  return bars(data, { width, bar, sort });
};
