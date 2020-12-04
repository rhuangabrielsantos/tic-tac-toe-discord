const express = require('express');
const mongoose = require('mongoose');

let app = express();

const PORT = process.env.PORT || 3002;

mongoose.connect(
    `mongodb+srv://tictactoe:${process.env.DB_PASSWORD}@cluster0.80hf3.mongodb.net/development?retryWrites=true&w=majority`, 
    { useNewUrlParser: true }
);

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});