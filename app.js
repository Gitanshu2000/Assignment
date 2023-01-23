const express = require('express');
const app = express();
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();
const fs = require("fs");
const readline = require("readline");
const bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.set('views', 'views')
const multer = require('multer');
app.use(express.static('public'))


//filter that receive only csv files
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};

//storage for csv files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage: storage, fileFilter: csvFilter });
const fastCsv = require('fast-csv');


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-   //form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// credentials for cloud API  (not in this folder)
const CREDENTIALS = require('./local.json');

// Configuration for Cloud API
const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id
});

//Configuration of MYSQL Database
var mysql = require('mysql2');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gitanshu@101",
  database: "assignment"
});

//Route for handling and uploading CSV files
app.post('/upload', upload.single('file'), (req, res, next) => {
  const results = [];
  fastCsv
    .parseFile(req.file.path)
    .on('data', function (data) {
      results.push(data); // push each row
    })
    .on('end', function () {
      SavedLang(results, 'en')
      translate_lang(results, 'hi');
      translate_lang(results, 'pa');
      translate_lang(results, 'mr');
      translate_lang(results, 'te');
      res.redirect('/homepage')
    });
})




// Our function for translating into different languages
async function translate_lang(data, lang) {
  let rows = data.length;
  if (rows == 0)
    return;

  let convertedData = [];
  for (let i = 0; i < rows; i++) {
    try {
      let i_row = await translateText(data[i], lang);
      convertedData.push(i_row);
    }
    catch (err) {
      console.log(err);
    }
  }
  SavedLang(convertedData, lang);
}

// translate : function which tranlate our text through Google Translate Api
const translateText = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log(`Error at translateText --> ${error}`);
    return 0;
  }
};


//function for saving language's data into database
function SavedLang(data, lang) {
  con.connect(error => {
    if (error) {
      console.error(error);
    } else {
      if (lang === 'en') {
        let query =
          "INSERT INTO farmers_en (name,address,age,phone,fid) VALUES ?";
        con.query(query, [data], (error, response) => {
          if (error) console.log(error);

        });
      }
      else if (lang === 'hi') {
        let query =
          "INSERT INTO farmers_hi (name,address,age,phone,fid) VALUES ?";
        con.query(query, [data], (error, response) => {
          if (error) console.log(error);

        });
      }
      else if (lang === 'mr') {
        let query =
          "INSERT INTO farmers_mr (name,address,age,phone,fid) VALUES ?";
        con.query(query, [data], (error, response) => {
          if (error) console.log(error);
        });
      }
      else if (lang === 'pa') {
        let query =
          "INSERT INTO farmers_pa (name,address,age,phone,fid) VALUES ?";
        con.query(query, [data], (error, response) => {
          if (error) console.log(error);
        });
      }
      else if (lang === 'te') {
        let query =
          "INSERT INTO farmers_te (name,address,age,phone,fid) VALUES ?";
        con.query(query, [data], (error, response) => {
          if (error) console.log(error);
        });
      }
    }
  });
}


//Route for showing farmer's data to the users in different languages
app.post('/homepage', (req, res, next) => {
  const data = req.body.select;
  con.connect(error => {
    if (error) {
      console.error(error);
    } else {
      if (data === 'punjabi') {
        let query =
          "Select * from farmers_pa";
        con.query(query, (error, response) => {
          res.render('homepage', { data: response, text: "",lang:data });
        });
      }
      else if (data === 'hindi') {

        let query =
          "Select * from farmers_hi";
        con.query(query, (error, response) => {
          res.render('homepage', { data: response, text: "",lang:data });
        });
      }
      else if (data === 'telugu') {
        let query =
          "Select * from farmers_te";
        con.query(query, (error, response) => {
          res.render('homepage', { data: response, text: "",lang:data });
        });
      }
      else if (data === 'marathi') {
        let query =
          "Select * from farmers_mr";
        con.query(query, (error, response) => {
          res.render('homepage', { data: response, text: "",lang:data });
        });
      }
      else {
        let query =
          "Select * from farmers_en";
        con.query(query, (error, response) => {
          res.render('homepage', { data: response, text: "" ,lang:data});
        });
      }

    }
  });
})


//Homepage route
app.get('/homepage', (req, res) => {
  res.render('homepage', { data: [], text: '*Firstly Select your language',lang:"" })
})

//index page route
app.get('/', (req, res) => {
  res.render('index')
})

//route for get Api call of login 
app.get('/login', (req, res) => {
  res.render('login', { error: "" })
})

//route for post api of login ( as only authenticated user can upload farmers data)
app.post('/login', async (req, res) => {
  const id = req.body.uid;
  const password = req.body.password;
  con.connect(error => {
    if (error) {
      console.error(error);
    } else {
      let query = `SELECT name FROM login WHERE id = "${id}" AND password = "${password}"`
      con.query(query, async (error, response) => {
        if (error) throw error;
        if (response.length) {
          res.render('upload', { name: response[0].name })
        }
        else {
          res.render('login', { error: "Invalid Userid or Password" })
        }
      });
    }
  });
})


//Route for handling all other routes

app.use('/',(req,res,next)=>{
  res.render('404');
})
//app listening at mentioning port
app.listen(3000)


