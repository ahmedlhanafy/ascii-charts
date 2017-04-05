const express = require('express');
const bodyParser = require('body-parser');
const parse = require('csv-parse/lib/sync');
const generateLineChart = require('./generateLineChart');
const generateBars = require('./generateBars');

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(allowCrossDomain);

app.post('/', (req, res) => {
  const commaSeperatedData = req.body.data;
  if (!commaSeperatedData) {
    res.status('400').send('Please provide data field');
  }
  const method = req.body.method;
  console.log('heyy')
  try {
    const data = parse(commaSeperatedData).map(arr => [
      arr[0],
      parseFloat(arr[1], 10)
    ]);
    console.log(data);
    if (method === 'bars') {
      res.send(generateBars(data, req.body.width, req.body.bar, req.body.sort));
    } else if (method === 'lines') {
      res.send(generateLineChart(data, req.body.width));
    } else {
      res.status('400').send('Please provide a method to use');
    }
  } catch (e) {
    res.status('400').send('CSV text is malformed');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('The server is now running'));