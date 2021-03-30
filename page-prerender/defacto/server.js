
const express = require('express');
const app = express();

console.log(process.pid);

app.use(express.static('page-build'));
app.listen(8080, () => console.log('Server started. Press Ctrl+C to quit'));





