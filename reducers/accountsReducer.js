'use strict';

const {
  FETCH_ACCOUNT_REQUEST,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILURE,
  FETCH_ACCOUNTS_REQUEST,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_FAILURE
} = require('../actions/accountActions');

const initialState = {
  accounts: [],
  current: {},
  loading: false,
  error: null,
  currentEmail: null
};

function accountsReducer (state = initialState, action) {
  switch (action.type) {
    case FETCH_ACCOUNT_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ACCOUNT_SUCCESS:
      return { ...state, loading: false, current: action.payload };
    case FETCH_ACCOUNT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_ACCOUNTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ACCOUNTS_SUCCESS:
      return { ...state, loading: false, accounts: action.payload };
    case FETCH_ACCOUNTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      // No state change
      return state;
  }
}

module.exports = accountsReducer;
