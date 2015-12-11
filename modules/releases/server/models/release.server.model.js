'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



// NOTE : While nice for development, it is recommended this behavior be disabled in
 // production since index creation can cause a significant performance impact. Disable the behavior
 // by setting the autoIndex option of your schema to false, or globally on the connection by
 // setting the option config.autoIndex to false.
/**
 * Release Schema
 */
var ReleaseSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  utrack_id1: {
    type: Number,
    required: 'uTrack ID cannot be blank'
  },
  utrack_id2: {
    type: Number,
    default: 0
  },
  utrack_id3: {
    type: Number,
    default: 0
  },
  utrack_id4: {
    type: Number,
    default: 0
  },
  utrack_id5: {
    type: Number,
    default: 0
  },
  mr_links: {
    type: Array,
    default: []
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
mongoose.model('Release', ReleaseSchema);
