'use strict';

// Dependencies
const { createStore, combineReducers, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

// Reducers
const adminReducer = require('../reducers/adminReducer');
const authReducer = require('../reducers/authReducer');
const bridgeReducer = require('../reducers/bridgeReducer');
const contractReducer = require('../reducers/contractReducer');
const documentReducer = require('../reducers/documentReducer');
const fileReducer = require('../reducers/fileReducer');
const invitationReducer = require('../reducers/invitationReducer');
const accountsReducer = require('../reducers/accountsReducer');
const searchReducer = require('../reducers/searchReducer');

// Root
const rootReducer = combineReducers({
  auth: authReducer,
  bridge: bridgeReducer,
  contracts: contractReducer,
  documents: documentReducer,
  files: fileReducer,
  stats: adminReducer,
  invitation: invitationReducer,
  accounts: accountsReducer,
  search: searchReducer
});

module.exports = createStore(rootReducer, applyMiddleware(thunkMiddleware));
