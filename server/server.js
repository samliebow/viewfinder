const express = require('express');
const app = express();

const PORT = process.env.port || 3033;

app.use(express.static('client/dist'));

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})