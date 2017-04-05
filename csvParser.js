// This takes a comma separated string and produce an array
// that looks like that
// [ [ 'Start', '100' ],
//   [ ' ', '184' ],
//   [ ' ', '190' ],
//   [ ' ', '114' ],
//   [ ' ', '144' ],
//   [ 'End', '104' ] ]
module.exports = commaSeparatedData =>
  commaSeparatedData
    .split(',')
    .map(entry => entry.split(','))
    .map(arr => arr[0])
    .reduce(
      (a, b, index) => {
        if (index % 2 === 0) {
          a.push([b]);
          return a;
        } else {
          a[a.length - 1].push(b);
          return a;
        }
      },
      []
    );
