const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const list = require('./SheetUpload/SheetUpload_route');
const profile = require('./Profile/Profile_route');

dotenv.config()
const connection_url = process.env.MONGOOSE;
const port = process.env.PORT || 8005;
const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*"),
    next()
});
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use('/data', list);
app.use('/profile', profile);

app.listen(port, () => console.log(`listening to port ${port}`));