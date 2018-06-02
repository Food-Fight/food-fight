let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'FILL_ME_IN',
  database: 'test',
});

let selectAll = function (callback) {
  connection.query('SELECT * FROM items', (err, results, fields) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports.selectAll = selectAll;
