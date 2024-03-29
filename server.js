const express = require('express');
const port = process.env.PORT || 3000;

console.log('The port  selected is: ', port);
app = express();

app.use(express.static(__dirname + '/dist/'));
app.get(/.*/, function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port);

console.log('Server started...');
