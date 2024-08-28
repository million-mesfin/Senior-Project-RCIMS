const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://millionmesfind:test-password@test-cluster.esbxt.mongodb.net/?retryWrites=true&w=majority&appName=TEST-CLUSTER', {
    serverSelectionTimeoutMS: 5000
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB', err);
});

module.exports = mongoose;