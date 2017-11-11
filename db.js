var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/server_mongo:27017')
var Schema = mongoose.Schema;

var payment_schema = new Schema
  ({
    db_payment_date   : Date,
    db_payment_type   : String,
    db_product        : String,
    db_product_price  : Number,
    db_discount       : Number,
    db_price          : Number,
    db_transaction_id : Number
  });

var Payment = mongoose.model('Payment', payment_schema);

module.exports = Payment;
