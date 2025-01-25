'use strict';

// Dependencies
const React = require('react');
// const { Link, Route, Routes, Switch } = require('react-router-dom');

// Semantic UI
const {
  Card,
  Grid,
  Icon,
  Image
} = require('semantic-ui-react');

const HeaderBar = require('./HeaderBar');
const LoginForm = require('./LoginForm');

class LoginPage extends React.Component {
  render () {
    const { login, register, error, onLoginSuccess, onRegisterSuccess } = this.props;

    return (
      <fabric-hub-login-page class="fade-in">
        <HeaderBar showBrand={true} />
        <Card fluid>
          <Card.Content>
            <Card.Header as='h2'><Icon name='key' /> Sign In</Card.Header>
            <LoginForm {...this.props} login={login} error={error} onLoginSuccess={onLoginSuccess} />
          </Card.Content>
        </Card>
      </fabric-hub-login-page>
    );
  }
}

module.exports = LoginPage;
