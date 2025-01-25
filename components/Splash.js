'use strict';

// Dependencies
const React = require('react');
const { Route, Routes } = require('react-router-dom');

// Components
// const AccountCreator = require('./AccountCreator');
const FrontPage = require('./FrontPage');
const LoginPage = require('./LoginPage');
const TermsOfUse = require('./TermsOfUse');

class Splash extends React.Component {
  render () {
    const { auth, login, register, error, onLoginSuccess, onRegisterSuccess } = this.props;
    return (
      <fabric-hub-splash class='fade-in splash'>
        <fabric-component class='ui primary action fluid container'>
          <Routes>
            <Route path='/' element={<FrontPage login={login} error={error} onLoginSuccess={onLoginSuccess} createInquiry={this.props.createInquiry} inquiries={this.props.inquiries} />} />
            <Route path='/sessions' element={<LoginPage login={login} error={error} onLoginSuccess={onLoginSuccess} />} />
            <Route path='/contracts/terms-of-use' element={<TermsOfUse onAgreeSuccess={onLoginSuccess} fetchContract={this.props.fetchContract} />} />
          </Routes>
        </fabric-component>
      </fabric-hub-splash>
    );
  }
}

module.exports = Splash;
