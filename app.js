const express = require('express');


const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

app.listen(3000, () => {
    console.log('listening to requests on PORT 3000...');
});