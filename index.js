const express = require('express');
const bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });
const parse = require('csv-parse/lib/sync');
const generateLineChart = require('./generateLineChart');
const generateBars = require('./generateBars');
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(allowCrossDomain);
app.use(express.static(__dirname + '/View'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.post('/upload', upload.single('file'), (req, res, next) => {
  const fileInfo = req.file;
  const method = req.body.method;
  if (!fileInfo) {
    res.status('400').send('Please upload a CSV file');
    return;
  }
  if (!method) {
    res.status('400').send('Please sepcify a method to use');
    return;
  }
  const file = fs.readFileSync(`${__dirname}/${fileInfo.path}`, 'utf8');
  generateCharts(res, file, method);
});

app.post('/', (req, res) => {
  const commaSeperatedData = req.body.data;
  if (!commaSeperatedData) {
    res.status('400').send('Please provide data field');
  }
  const method = req.body.method;
  generateCharts(res, commaSeperatedData, method);
});

const generateCharts = (res, commaSeperatedText, method, width, bar, sort) => {
  try {
    const data = parse(commaSeperatedText)
      .map(arr => [arr[0], parseFloat(arr[1], 10)])
      .filter(arr => !isNaN(arr[1]));

    if (method === 'bars') {
      res.send(generateBars(data, width, bar, sort));
    } else if (method === 'lines') {
      res.send(generateLineChart(data, width));
    } else {
      res.status('400').send('Please provide a valid method to use');
    }
  } catch (e) {
    res.status('400').send('CSV text is malformed');
  }
};

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('The server is now running'));
