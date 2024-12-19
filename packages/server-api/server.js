const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const empRoutes = require('./routes/employees');
const empRoutes = require('./routes/employees');
const adminRoutes = require('./routes/admins');
const tempRoutes = require('./routes/templist');
const hostedsitesRoutes = require('./routes/hostedSites')
const performanceRoutes = require('./routes/performance')
const paymentRoutes = require('./routes/payment')
const clientRoutes = require('./routes/clientdetails')
const bugreportRoutes = require('./routes/bugreport')
const taskRoutes = require('./routes/taskReports')
const SuperAdminRoutes = require('./routes/superAdminRoute')
const app=express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");
const dotenv = require('dotenv')


dotenv.config();
//middle ware
app.use(cors());
app.use(express.json());


app.use(bodyParser.json())

//Connect to mongo Db
mongoose

  .connect(process.env.MONGO_URI)

  .then(() => console.log('Connected to MongoDB'))

  .catch((err) => console.error('Failed to connect to MongoDB:', err));
 

//use routes
app.use('/api/auth',SuperAdminRoutes);
app.use('/api/employees', empRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/templist', tempRoutes);
app.use('/api/hostedsites',hostedsitesRoutes);
app.use('/api/performence',performanceRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/clientdetails', clientRoutes);
app.use('/api/bugreport', bugreportRoutes);
app.use('/api/taskreports', taskRoutes);



app.listen(PORT ,()=>console.log(`Server Running On PORT  ${PORT}`,process.env.MONGO_URI));

