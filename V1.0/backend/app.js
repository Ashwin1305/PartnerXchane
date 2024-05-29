const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
let dayjs = require('dayjs');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

// Create conn
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

function generateAccessToken(username) {
  return jwt.sign(username, "key", { expiresIn: '7200s' });
}

function authenticateToken(req, res, next) {
  // Get auth header value
  const authHeader = req.headers['authorization'];
  // Check if authHeader is undefined
  if (typeof authHeader !== 'undefined') {
    // Split at the space and get token from array
    const token = authHeader.split(' ')[1];
    // Verify token
    jwt.verify(token, "key", (err, user) => {
      if (err) {
        // console.log(err
        // If error, respond with 403 status code and error message
        return res.status(403).send('403');
      }
      // If token is verified, set req.user and call next middleware function
      req.user = user;
      next();
    });
  } else {
    // If authHeader is undefined, return 401 status code
    res.status(401).send('authHeader is undefined');
  }
}
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_CONTAINER_NAME;
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);
const upload = multer({ storage: multer.memoryStorage() });
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const blobName = req.file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype,
      },
    };

    await blockBlobClient.uploadData(req.file.buffer, uploadOptions);

    const publicUrl = blockBlobClient.url;
    console.log(`File uploaded to ${publicUrl}`);

    res.status(200).send(`File uploaded successfully: ${publicUrl}`);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

app.post('/login', (req, res) => {
  // console.log(req.body)
  const { name, password } = req.body;

  // Query to check if the username and password are correct
  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  connection.query(query, [name, password], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    // If results have length greater than 0, it means user exists with provided credentials
    if (results.length > 0) {
      const token = generateAccessToken({ username: results[0].username,name:results[0].name,type: results[0].type,id:results[0].id,pp:results[0].pp });
      res.status(200).json({ "user": results[0], "jwt": token });
    } else {
      res.status(401).json('ghjwk')
    }
  });
});
app.use(authenticateToken);
app.use((req, res, next) => {
  // Wait for the response to finish
  res.on('finish', () => {
    // Create a new log entry
    const logEntry = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      time: new Date(),
      body: JSON.stringify(req.body),
      user: JSON.stringify(req.user.username)  // Add the request body to the log entry
    };

    // Save the log entry to the database
    const query = 'INSERT INTO logs SET ?';
    connection.query(query, logEntry, (err, result) => {
      if (err) throw err;
      // console.log('Log entry saved');
    });
  });

  // Call the next middleware function
  next();
});

const validateUser = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long'),
  body('Avatar').isURL().withMessage('Avatar must be a URL'),
  body('type').not().isEmpty().withMessage('Type is required'),
  body('username').not().isEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Email is required and should be an email'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
app.post('/newuser', validateUser, (req, res) => {
  // Assuming you have a connection to your MySQL database

  let sql1 = `INSERT INTO user (name, password, pp, type,username,email) VALUES (?, ?, ?, ?,?,?)`;
  let values1 = [req.body.name, req.body.password, req.body.Avatar, req.body.type, req.body.username, req.body.email];
  connection.query(sql1, values1, (err, result) => {
    if (err) throw err;
    // console.log("Record inserted into user table");
    if (req.body.type == "user") {

      let sql2 = `INSERT INTO leaderboard (user) VALUES (?)`;
      let values2 = [req.body.name];

      connection.query(sql2, values2, (err, result) => {
        if (err) throw err;

        // console.log("Record inserted into leaderboard table");
        res.status(200).send('Data added successfully');


      }
      )
    }
    else {
      res.status(200).send('Data added successfully');

    }
  });

});

// Apply middleware globally to all routes
app.get('/user', (req, res) => {
  connection.query('SELECT name,type,Implementor,Developer FROM user', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.json(results);
  });
});
app.get('/leaderboard', (req, res) => {
  connection.query('SELECT leaderboard.id, leaderboard.user, leaderboard.onboard_capacity, leaderboard.projectCapacity, leaderboard.ShiftHour,leaderboard.file,leaderboard.milestone,leaderboard.TopPerformer,leaderboard.Notes,leaderboard.dateRange, user.pp, user.type FROM leaderboard JOIN user on leaderboard.user = user.name', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.json(results);
  });
});

app.get('/leaderboard/:username', (req, res) => {
  // console.log(req.body)
  const query = 'SELECT leaderboard.onboard_capacity FROM leaderboard WHERE leaderboard.user = ?';
  connection.query(query, [req.params.username], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.json(results);
  });
});

app.get('/archive', (req, res) => {
  connection.query('SELECT LBarchive.id, LBarchive.date, LBarchive.user, LBarchive.ShiftHour,LBarchive.file, user.pp FROM LBarchive JOIN user on LBarchive.user = user.name', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    // console.log(results);
    res.json(results);
  });
});

app.put('/updateLB/:id', (req, res) => {
  // Extract data from the request body
  console.log(req.body)
  const { ShiftHour, projectCapacity, onboard_capacity, file ,achieBtn,Notes,dateRange} = req.body;
  const id = req.params.id;
  const timechange = req.body.timeChange;
  // console.log(timechange);
  const query = 'UPDATE leaderboard SET ShiftHour = ?, projectCapacity=?, onboard_capacity =?,file=?,TopPerformer=?,Notes=?,dateRange=? WHERE id = ?';
  connection.query(query, [ShiftHour, projectCapacity, onboard_capacity, file,achieBtn,Notes,dateRange, id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json('Data updated successfully');
  });
  if (timechange) {
    let data = { user: req.body.user, ShiftHour: ShiftHour, date: dayjs().format("DD/MM/YYYY"), file: req.body.file };
    let sql = 'INSERT INTO LBarchive SET ?';
    connection.query(sql, data, (err, result) => {
      if (err) throw err;
      // console.log(result);
      // res.send('Data inserted into LBarchive...');
    });
    // const query = 'UPDATE leaderboard SET ShiftHour = ?,file=? WHERE id = ?';
    // connection.query(query, ["00:00 AM  00:00 AM CST", null, id], (error, results, fields) => {
    //   if (error) {
    //     console.error('Error executing query: ' + error.stack);
    //     // return res.status(500).send('Error executing query');
    //   }
    // res.status(200).json('Data updated successfully');
    // });
  }
});

app.put('/updateMilestone/:id', (req, res) => {
  // Extract data from the request body
  // console.log(req.body)
  // const {  } = req.body;
  const id = req.params.id;
  // const timechange = req.body.timeChange;
  // console.log(id);
  const query = 'SELECT * FROM leaderboard WHERE user = ?';

  connection.query(query, [id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    Milestone = JSON.parse(results[0].milestone)
    Milestone.push(req.body)
    console.log(Milestone);
    const query = 'UPDATE leaderboard SET milestone = ? WHERE id = ?';
    connection.query(query, [JSON.stringify(Milestone),results[0].id], (error, results, fields) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        return res.status(500).send('Error executing query');
      }
      // console.log(results);
      res.status(200).json('Data updated successfully');
    })
  });
  
  
});


app.put('/updateP/:id', (req, res) => {
  // Extract data from the request body
  // console.log(req.body)
  const { CEnv, CMilestone, CQA, CProduction, CGoLive, CProjectLead, Jira, Severity, DevEnviornment, BYRemark,Notes } = req.body;
  const id = req.params.id;

  const query = 'UPDATE projects SET Environment  = ?, Milestone =? , QAEnviornment =?, Production=?, GoLive=?, ProjectLead=?,Jira=?,Severity=?,DevEnviornment=?,BYRemark=?,Notes=? WHERE id = ?';
  connection.query(query, [CEnv, CMilestone, CQA, CProduction, CGoLive, CProjectLead, Jira, Severity, DevEnviornment, BYRemark,Notes, id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json('Data updated successfully');
  });
});

app.post('/newProject', (req, res) => {
  const { RequestID, Customer, ProjectedGoLive, Milestone, EDIVersion, EDIMessageType, ProjectLead, Environment, CarrierOnboarding, Dev_Environment, Production, GoLive, QAEnviornment, MappingSpecification, CustomerCode, BYRemark,ProjectType,Implementor,Developer } = req.body;

  // Insert new project into the database
  const query = 'INSERT INTO projects (RequestID, Customer, ProjectedGoLive, Milestone, EDIVersion, EDIMessageType, ProjectLead, Environment, CarrierOnboarding, DevEnviornment, Production, GoLive, QAEnviornment,MappingSpecification,CustomerCode,BYRemark,ProjectType,Implementor,Developer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)';
  connection.query(query, [RequestID, Customer, ProjectedGoLive, Milestone, EDIVersion, EDIMessageType, ProjectLead, Environment, CarrierOnboarding, Dev_Environment, Production, GoLive, QAEnviornment, MappingSpecification, CustomerCode, BYRemark,ProjectType,Implementor,Developer], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(201).send('Project added successfully');
  });
});

app.get('/projects', (req, res) => {
  // Select all projects from the database
  const query = "SELECT * FROM projects WHERE GoLive NOT IN ('Cancelled', 'Completed') AND DevEnviornment != 'Cancelled' AND Production != 'Cancelled' AND QAEnviornment != 'Cancelled' AND (ProjectType != 'Upgrade' OR (ProjectType = 'Upgrade' AND GoLive != 'Completed'))";
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json(results);
  });
});

app.get('/projects/:ProjectLead', (req, res) => {
  // console.log(req.params);
  // Select all projects for a specific ProjectLead from the database
  const query = "SELECT * FROM projects WHERE ProjectLead = ? AND GoLive NOT IN ('Cancelled', 'Completed') AND DevEnviornment != 'Cancelled' AND Production != 'Cancelled' AND QAEnviornment != 'Cancelled' AND (ProjectType != 'Upgrade' OR (ProjectType = 'Upgrade' AND GoLive != 'Completed'))";
  connection.query(query, [req.params.ProjectLead], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json(results);
  });
});

app.post('/newRequest', (req, res) => {
  console.log(req.body);
  const { RequestID, Customer, CarrierName, SCAC, Phase, Completion, Milestone, TPSpecialist, TicketNumber, BYRemarks, IPOwner, SFTP, Testing204, TestingIFTMIN, TestingIFTSTA, GoLive, TestingJSON, TradingPartnerSetup, disabledArray } = req.body;

  // Insert new reinto the onboarding table
  const query = `INSERT INTO onboarding (RequestID, Customer, CarrierName, SCAC, Phase, Completion, Milestone, TPSpecialist, TicketNumber, BYRemarks, IPOwner, SFTP, Testing204, TestingIFTMIN, TestingIFTSTA, GoLive,TestingJSON,TradingPartnerSetup,disabledArray) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;
  connection.query(query, [RequestID, Customer, CarrierName, SCAC, Phase, Completion, Milestone, TPSpecialist, TicketNumber, BYRemarks, IPOwner, SFTP, Testing204, TestingIFTMIN, TestingIFTSTA, GoLive, TestingJSON, TradingPartnerSetup, disabledArray], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(201).send('Record added successfully');
  });
});

app.patch('/updateOB/:id', (req, res) => {
  // Extract data from the request body
  // console.log(req.body)
  const { IPOwner, OCValidation, Testing204, GoLive, TestingJSON, SFTP, BYRemarks, TradingPartnerSetup, Completion, Milestone, disabledArray, active,Notes } = req.body;
  const id = req.params.id;
  const query = "UPDATE onboarding SET IPOwner  = ?, OCValidation =? , Testing204 =?, GoLive=?,TestingJSON=?,SFTP=?,BYRemarks=?,TradingPartnerSetup=?,Completion=?,Milestone=?,disabledArray=?,active=?,Notes=? WHERE id = ? ";
  connection.query(query, [IPOwner, OCValidation, Testing204, GoLive, TestingJSON, SFTP, BYRemarks, TradingPartnerSetup, Completion, Milestone, disabledArray, active,Notes, id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json('Data updated successfully');
  });
});
app.patch('/uploadCQdoc/:id', (req, res) => {
  // Extract data from the request body
  console.log(req.body)
  const { CQDoc, OCValidation, TestingJSON, TradingPartnerSetup, SFTP, GoLive, disabledArray } = req.body;
  const id = req.params.id;
  const query = "UPDATE onboarding SET CQDoc=? ,OCValidation=?,TestingJSON=?,TradingPartnerSetup=?,SFTP=?,GoLive=?,disabledArray=? WHERE id = ? ";
  connection.query(query, [CQDoc, OCValidation, TestingJSON, TradingPartnerSetup, SFTP, GoLive, disabledArray, id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json('Data updated successfully');
  });
});
app.put('/editOB/:id', (req, res) => {
  // console.log(req.body);
  let sql = `UPDATE onboarding SET CarrierName = ?, SCAC = ?, TestingJSON = ?, TicketNumber = ?, SFTP = ?, TradingPartnerSetup = ?, GoLive=? WHERE id = ?`;
  let data = [req.body.CarrierName, req.body.SCAC, req.body.TestingJSON, req.body.TicketNumber, req.body.SFTP, req.body.TradingPartnerSetup, req.body.GoLive, req.params.id];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.send('Row updated successfully.');
  });
});
app.put('/editPJ/:id', (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const { Customer, CustomerCode, EDIVersion, EDIMessageType, ProjectedGoLive, GoLive, QAEnviornment, DevEnviornment, Production, MappingSpecification,ProjectType,Implementor,Developer } = req.body;

  const query = 'UPDATE projects SET Customer = ?, CustomerCode = ?, EDIVersion = ?, EDIMessageType = ?, ProjectedGoLive = ?, GoLive = ?, QAEnviornment = ?, DevEnviornment = ?, Production = ?, MappingSpecification = ?,ProjectType=?,Implementor=?,Developer=? WHERE id = ?';

  connection.query(query, [Customer, CustomerCode, EDIVersion, EDIMessageType, ProjectedGoLive, GoLive, QAEnviornment, DevEnviornment, Production, MappingSpecification,ProjectType,Implementor,Developer, id], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred while updating the project.');
    } else {
      res.status(200).send('Project updated successfully.');
    }
  });
});
app.get('/getOB', (req, res) => {
  // Query to get all records from the onboarding table
  const query = "SELECT * FROM onboarding WHERE GoLive NOT IN ('Completed', 'Cancelled') AND active = 'true' AND OCValidation != 'Cancelled' ";

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }

    res.status(200).json(results);
  });
});
app.get('/getOB/:IPOwner', (req, res) => {
  // console.log(req.params);
  // Select all projects for a specific ProjectLead from the database
  const query = 'SELECT * FROM onboarding WHERE IPOwner = ?';
  connection.query(query, [req.params.IPOwner], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json(results);
  });
});

app.delete('/deleteOB/:id', (req, res) => {
  // Delete all projects for a specific IPOwner from the database
  const query = 'DELETE FROM onboarding WHERE id = ?';
  connection.query(query, [req.params.id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).send('Records deleted successfully');
  });
});
app.delete('/deleteP/:id', (req, res) => {
  // Delete all projects for a specific IPOwner from the database
  try {
    const query = 'DELETE FROM projects WHERE id = ?';
    connection.query(query, [req.params.id], (error, results, fields) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        return res.status(500).json({ err: 'Cannot delete this project as it already exists in Onboarding' });
      }
      res.status(200).send('Records deleted successfully');
    });

  } catch (error) {
    console.log("error");
  }
});

app.get('/getOBCustomer/:Customer', (req, res) => {
  // console.log(req.params);
  // Select all projects for a specific ProjectLead from the database
  const query = 'SELECT * FROM onboarding WHERE Customer = ?';
  connection.query(query, [req.params.Customer], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json(results);
  });
});

app.post('/newNoti', (req, res) => {
  const { userID, msg, assignedBY } = req.body;
  let mail;
  // connection.query("SELECT email FROM user WHERE name = ? ", [userID], (error, results, fields) => {
  //   mail = results[0].email
  //   // console.log(results[0].email)
  //   const transporter = nodemailer.createTransport({
  //     service: process.env.SMTP_SERVICE,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS
  //     }
  //   });
  //   // console.log(mail);
  //   let mailOptions = {
  //     from: process.env.SMTP_USER,
  //     to: mail.toString(),
  //     subject: 'Portal notification',
  //     text: msg
  //   };
  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });
  // })
  // Insert new record into the notification table
  const query = `INSERT INTO notification (userID, msg, assignedBY) VALUES (?, ?, ?)`;
  connection.query(query, [userID, msg, assignedBY], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(201).json({ message: 'Notification created' });
  });
});

app.get('/getNoti/:id', (req, res) => {
  // Select all projects from the database
  const id = req.params.id;

  const query = 'SELECT * FROM notification where userID=?';
  connection.query(query, [id], (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ' + error.stack);
      return res.status(500).send('Error executing query');
    }
    res.status(200).json(results);
  });
});
app.post('/deleteNotifications', (req, res) => {
  const idsToDelete = req.body.ids; // assuming you're sending an array of ids in the request body
  if (idsToDelete && idsToDelete.length > 0) {
    const sql = `DELETE FROM notification WHERE id IN (${idsToDelete.join(',')})`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send('Notifications deleted');
    });
  } else {
    res.status(400).send('No ids provided');
  }
});
app.get('/ob/archive', async (req, res) => {
  try {
    const query = `SELECT * FROM onboarding WHERE GoLive = 'Completed' OR GoLive = 'Cancelled' OR active = 'false' OR OCValidation = 'Cancelled'`;
    const result = await connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        return res.status(500).send('Error executing query');
      }
      // console.log(results);
      res.status(200).json(results);
    });
    // res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});
app.get('/pj/archive', async (req, res) => {
  // console.log("ghjk");
  try {
    const query = "SELECT * FROM projects WHERE (GoLive = 'Cancelled' OR Production = 'Cancelled' OR DevEnviornment= 'Cancelled' OR QAEnviornment= 'Cancelled') OR (ProjectType = 'Upgrade' AND GoLive = 'Completed')";
    const result = await connection.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        return res.status(500).send('Error executing query');
      }
      // console.log(results);
      res.status(200).json(results);
    });
    // res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

// Close the database connection when the app is terminated
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing database connection: ' + err.stack);
      return;
    }
    console.log('Database connection closed');
    process.exit();
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
