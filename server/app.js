var http = require('http')
var https = require('https')
var fs = require('fs')
var path = require('path')
var cors = require('cors')
var dayjs = require('dayjs')
var axios = require('axios')
var dotenv = require('dotenv')
var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')

dotenv.config()

const port = 80
const app = express()




app.use(cors())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))


app.use(express.static(__dirname + '/'));
var router = require('./routes/index')
app.use('/', router);


var server  = http.createServer(app).listen(port)





server.on('error', onError)
server.on('listening', ()=>{ console.log(`Listening on Port ${port}`) })

function onError(error) {
  if (error.syscall !== 'listen') { throw error; }
  switch (error.code) {
    case 'EACCES':
      console.error('Port 80 requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port 80 is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
