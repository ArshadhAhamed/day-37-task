
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());


connectDB();


const mentorRoutes = require('./routes/mentors');
const studentRoutes = require('./routes/students');


app.use('/mentors', mentorRoutes);
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
