'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Harness Schema
 */
var HarnessSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  vm_name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  meta_data: {
    type: String,
    default: '',
    trim: true
  },
  vm_id: {
    type: Schema.ObjectId
  },
  utrack_id: {
    type: []
  },
  tc_build_id: {
    type: String,
    default: 'tc-id-build-01',
    trim: true
  },
  branches: {
    type: [Schema.Types.Mixed],
    // default: { branch: { name: "webui", pegged: "develop", setbranch:"" }, branch: { name: "dc", pegged: "develop", setbranch:"" } }
    // default: { webui: { pegged: 'develop', branch:"master" },
    //               dc: { pegged: 'develop', name: 'dc', branch:"master" }
    //
    // }
  },
  harness_status: {
    type: Number,
    default: 0
  },
  // test_mode: {
  //   type: String,
  //   default: 0
  // },
  data: {
    testresults: {},
    testmode: {}
  },
  expire: {
    type: Date,
    default: Date.now
  },
  need_refresh: {
    type: Boolean,
    default: 'false'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Harness', HarnessSchema);
