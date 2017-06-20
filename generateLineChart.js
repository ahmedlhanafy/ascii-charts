const { screen: blessedScreen } = require('blessed');
const { line: blessedLine } = require('blessed-contrib');
module.exports = (dataArray1 = [], dataArray2 = []) => {
  const data1 = { x: [], y: [] };
  const data2 = { x: [], y: [] };

  dataArray1.forEach(entry => {
    if (entry[0] !== '') data1.x.push(entry[0]);
    if (entry[1] !== undefined) data1.y.push(entry[1]);
  });

  dataArray2.forEach(entry => {
    if (entry[0] !== '') data2.x.push(entry[0]);
    if (entry[1] !== undefined) data2.y.push(entry[1]);
  });

  const screen = blessedScreen();

  const line = blessedLine({
    width: 44,
    height: 12,

    wholeNumbersOnly: true,
    style: {
      line: 'white',
      text: 'white',
      baseline: 'white',
    },
    xPadding: 10,
    maxY:
      (Math.max(...data1.y) > Math.max(...data2.y)
        ? Math.max(...data1.y)
        : Math.max(...data2.y)) + 7,
  });

  const replaceAll = (str, findArray, replace) => {
    let newStr = str;
    findArray.forEach(find => (newStr = newStr.split(find).join(replace)));
    return newStr;
  };

  screen.append(line); //must append before setting data

  line.setData([data1, data2]);

  // line.height = 'shrink';
  // line.width = 'shrink';

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.render();
  const screenshot = screen.screenshot();
  console.log(screenshot);
  screen.destroy();
  return replaceAll(screenshot, ['[37m', '[m'], '');
};
