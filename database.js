const mongoose = require('mongoose');
let user = '';
let password = '';
let url = '';
let databaseName = 'db';
if (process.env.NODE_ENV === 'test') {
    databaseName = 'testdb';
}

mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${databaseName}>?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true});