'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var QuoteSchema = new Schema({
  driverName: String,
  date: String,
  brand: String,
  carPrice: Number,
  rejected: Boolean,
  offer: Number
})

module.exports = mongoose.model('Quote', QuoteSchema)