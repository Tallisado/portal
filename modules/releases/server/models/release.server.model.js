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
  version: {
    type: String,
    required: 'Release Version cannot be blank',
    default: "v1.0.0a"
  },
  utrack_id1: {
    type: Number,
    required: 'uTrack ID cannot be blank'
  },
  utrack_id2: {
    type: String,
    default: ''
  },
  utrack_id3: {
    type: String,
    default: ''
  },
  utrack_id4: {
    type: String,
    default: ''
  },
  utrack_id5: {
    type: String,
    default: ''
  },
  utrack_details1: {
    type: String,
    required: 'uTrack ID cannot be blank',
    default: 'Related merge requests: <br/> \
           WebUI MR: http://nest.klipfolio.com/saas/saas-webui/merge_requests/567 <br/> \
           WebUI Tests MR: http://nest.klipfolio.com/qa/saas-webui-testing/merge_requests/4 <br/> \
           API Tests MR: http://nest.klipfolio.com/qa/saas-api-testing/merge_requests/2 <br/> \
           PM-613 Lock Data Source (enable creation of MOz Gallery Klips) <br/>'
  },
  utrack_details2: {
    type: String,
    default: ''
  },
  utrack_details3: {
    type: String,
    default: ''
  },
  utrack_details4: {
    type: String,
    default: ''
  },
  utrack_details5: {
    type: String,
    default: ''
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
