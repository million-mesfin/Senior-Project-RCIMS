const express = require('express');
const signupRoute = require('./routes/Signup');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createAdminAccount } = require('./scripts/setup');
const loginRoute = require('./routes/Login');
const authenticatedRoute = require('./routes/Authenticated');


const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());

createAdminAccount();

app.use('/user', signupRoute);
app.use('/auth', loginRoute);
app.use('/api', authenticatedRoute);


app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});