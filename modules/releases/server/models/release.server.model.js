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
  utrack_id: {
    type: String,
    required: 'uTrack ID cannot be blank'
  },
  utrack_url: {
    type: String,
    default: ''
  },
  utrack_name: {
    type: String,
    default: ''
  },
  git_merge_url: {
    type: String,
    default: ''
  },
  git_branch_url: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
mongoose.model('Release', ReleaseSchema);
