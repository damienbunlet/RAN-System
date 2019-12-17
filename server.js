// Load all require dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var fs = require('fs');
var path = require('path');
var url = require('url');
var SerialPort = require('serialport');

/* SERIALPORT DEFINITION :
 *
 * To communicate between this Node application and your Arduino,
 * you must set up the same baudrate value in this code and in your Arduino
 * program. Moreover, you must specify the serial port that will be used
 * by your master Arduino.
 *
 * Example of definition of usbSerial value
 * Windows    -> 'COM4'
 * Mac OS x   -> '/dev/cu.usbmodem1451'
 * Linux      -> '/dev/sda4'
 */
var usbSerial = 'COM4';
var arduino = new SerialPort(usbSerial, { baudRate: 115200 })

// Creation of the Express application
var server = express();
server.use(express.static(__dirname + '/public'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: false}))
  .use(favicon(__dirname + '/public/img/favicon.ico'));

/* DATABASE DEFINITION :
 *
 * You must have installed MongoDB on your computer and created a database
 * name "storage_gui" or the name of your choice.
 *
 * You must specify the URL of your database to connect to it.
 *
 * Example of URL :
 * 'mongodb://localhost:27017/{NAME_DATABASE}'
 * 'mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]'
 *
 * Read this documentation for more explication about the URL:
 * https://docs.mongodb.com/manual/reference/connection-string/
 */
var dbUrl = 'mongodb://localhost:27017/storage_gui';
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(err);
  });

/* MODEL DEFINITION :
 *
 * Those following models are used by Mongoose to generate an object in database.
 *
 * The component part is here to specify where your components are stocked and
 * some information about it.
 * You can add for exemple a mininum quantity to your schema to be inform when
 * your stock is low.
 *
 * The storage part is here to specify how many columns
 */

var componentSchema = new mongoose.Schema({
  name:         {type: String, required: true},
  quantity:     {type: Number, required: true},
  minquantity:  {type: Number, required: false},
  componentID:  {type: Number, required: true},
  storageID:    {type: Number, required: true},
  column:       {type: Number, required: true},
  row:          {type: Number, required: true}
});

var Component = mongoose.model('Component', componentSchema);

var storageSchema = new mongoose.Schema({
  storageID: {type: Number, required: true},
  columns:   {type: Number, required: true},
  rows:      {type: Number, required: true},
});

var Storage = mongoose.model('Storage', storageSchema);

/* ROUTE DEFINITION :
 *
 * It's here that you can manage your routes for the application.
 *
 * For this project, I create only one page to search, add, modify and delete
 * components and also manage storage, but you can create all page that you
 * need.
 */

server.get('/', function(req, res) {
  var title = 'Storage Management GUI';
  var storages = Storage.find();
  var components = Components.find();

  res.render('index.ejs', {
    title: title,
    storages: storages,
    components: components
  });
});

server.listen(8080);

/* DOCUMENTATION USE :
 *
 * https://www.locoduino.org/spip.php?article216
 * https://mongoosejs.com/docs/guide.html
 * https://serialport.io/docs/guide-about
 * https://ejs.co/#docs
 */
