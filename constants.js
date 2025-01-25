'use strict';

// Fabric Constants
const {
  GENESIS_HASH,
  MAGIC_BYTES,
  VERSION_NUMBER,
  FIXTURE_SEED
} = require('@fabric/core/constants');

const ALLOWED_UPLOAD_TYPES = [];
const ENABLE_CONVERSATION_SIDEBAR = false;
const ENABLE_NETWORK = true;

module.exports = {
  AUTHORITY: 'hub.fabric.pub',
  GENESIS_HASH,
  MAGIC_BYTES,
  VERSION_NUMBER,
  FIXTURE_SEED,
  ALLOWED_UPLOAD_TYPES,
  ENABLE_CONVERSATION_SIDEBAR,
  ENABLE_NETWORK
};
