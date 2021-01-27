const express = require('express');


const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening to requests on PORT ${PORT}...`);
});