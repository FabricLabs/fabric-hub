'use strict';

const { fetchFromAPI } = require('./apiActions');

async function fetchAccountsFromAPI(token) {
  // TODO: pagination
  return fetchFromAPI('/users', null, token);
}

// Action types
const FETCH_ACCOUNTS_REQUEST = 'FETCH_ACCOUNTS_REQUEST';
const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS';
const FETCH_ACCOUNTS_FAILURE = 'FETCH_ACCOUNTS_FAILURE';

const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

const PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST';
const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS';
const PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE';

// Action creators
const fetchAccountsRequest = () => ({ type: FETCH_ACCOUNTS_REQUEST, loading: true });
const fetchAccountsSuccess = (users) => ({ type: FETCH_ACCOUNTS_SUCCESS, payload: users, loading: false });
const fetchAccountsFailure = (error) => ({ type: FETCH_ACCOUNTS_FAILURE, payload: error, loading: false });

const fetchAccountRequest = () => ({ type: FETCH_USER_REQUEST, loading: true });
const fetchAccountSuccess = (instance) => ({ type: FETCH_USER_SUCCESS, payload: instance, loading: false });
const fetchAccountFailure = (error) => ({ type: FETCH_USER_FAILURE, payload: error, loading: false });

const askPasswordResetRequest = (email) => ({ type: PASSWORD_RESET_REQUEST, payload: email });
const askPasswordResetSuccess = () => ({ type: PASSWORD_RESET_SUCCESS });
const askPasswordResetFailure = (error) => ({ type: PASSWORD_RESET_FAILURE, payload: error });

// Thunk action creator
const fetchAccounts = () => {
  return async (dispatch, getState) => {
    dispatch(fetchAccountsRequest());
    const { token } = getState().auth;
    try {
      const users = await fetchAccountsFromAPI(token);
      dispatch(fetchAccountsSuccess(users));
    } catch (error) {
      dispatch(fetchAccountsFailure(error));
    }
  };
};

const fetchAccount = (id) => {
  return async (dispatch, getState) => {
    dispatch(fetchAccountRequest());
    const { token } = getState().auth;
    try {
      const instance = await fetchFromAPI(`/users/${id}`, null, token);
      dispatch(fetchAccountSuccess(instance));
    } catch (error) {
      dispatch(fetchAccountFailure(error));
    }
  };
};

const askPasswordReset = (email) => {
  return async (dispatch, getState) => {
    dispatch(askPasswordResetRequest(email));
    const { token } = getState().auth;
    try {
      // call for the fetch that generates the token for password reset
      const fetchPromise = fetch('/passwordReset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Email could not be sent. Please check your internet connection."));
        }, 60000);
      });

      const response = await Promise.race([timeoutPromise, fetchPromise]);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      //email with reset token sent
      dispatch(askPasswordResetSuccess());
    } catch (error) {
      dispatch(askPasswordResetFailure(error));
    }
  };
}


module.exports = {
  fetchAccount,
  fetchAccounts,
  askPasswordReset,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  FETCH_ACCOUNTS_REQUEST,
  FETCH_ACCOUNTS_SUCCESS,
  FETCH_ACCOUNTS_FAILURE,
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILURE,
};
