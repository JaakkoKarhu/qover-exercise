'use strict'

const mongoose = require('mongoose'),
      { Schema } = mongoose

const QuoteSchema = new Schema({
  driverName: String,
  date: String,
  brand: String,
  carPrice: Number,
  rejected: Boolean,
  offer: Number
})

module.exports = mongoose.model('Quote', QuoteSchema)