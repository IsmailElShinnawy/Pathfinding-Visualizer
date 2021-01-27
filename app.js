const express = require('express');


const app = express();
// app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening to requests on PORT ${PORT}...`);
});