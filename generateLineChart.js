const { screen: blessedScreen } = require('blessed');
const { line: blessedLine } = require('blessed-contrib');

module.exports = dataArray => {
  const screen = blessedScreen({
    width: 2,
    height: 2,
  });

  screen.width = 2;
  screen.height = 2;

  const line = blessedLine({
    style: {
      line: 'white',
      text: 'white',
      baseline: 'white',
    },
  });

  const replaceAll = (str, findArray, replace) => {
    let newStr = str;
    findArray.forEach(find => newStr = newStr.split(find).join(replace));
    return newStr;
  };

  const data = { x: [], y: [] };

  dataArray.forEach(entry => {
    if (entry[0] !== '') data.x.push(entry[0]);
    if (entry[1] !== undefined) data.y.push(entry[1]);
  });

  screen.append(line); //must append before setting data
  line.setData([data]);

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  screen.render();
  const screenshot = screen.screenshot();
  console.log(screenshot);
  screen.destroy();
  return replaceAll(screenshot, ['[37m', '[m'], '');
};
