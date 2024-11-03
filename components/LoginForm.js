'use strict';

const { FABRIC_KEY_DERIVATION_PATH } = require('@fabric/core/constants');

// Dependencies
const React = require('react');
const { Link, Navigate, Route, Routes, Switch } = require('react-router-dom');
// const AskPasswordResetModal = require('./LoginFormAskResetModal');

// Semantic UI
const {
  Button,
  Form,
  Icon,
  Message,
} = require('semantic-ui-react');

class LoginForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      loading: false,
      derivation: props.derivation || FABRIC_KEY_DERIVATION_PATH,
      username: '',
      password: '',
      pwdModalOpen: false,
    };
  }

  componentDidUpdate (prevProps) {
    // If a new login request has been initiated or an error has occurred, stop loading
    if ((this.props.error === null && prevProps.error !== null) || (this.props.error && prevProps.error !== this.props.error)) {
      this.setState({ loading: false });
    }
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handleSeedChange = (event) => {
    this.setState({ seed: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    this.setState({ loading: true });

    // Call login action creator
    this.props.login(username, password);
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // Toggle the modal
  togglePasswordModal = () => {
    this.setState(prevState => ({
      pwdModalOpen: !prevState.pwdModalOpen
    }));
  };

  render () {
    const { xprv, xpub, seed, derivation, username, password, loading, pwdModalOpen } = this.state;
    const { error } = this.props;

    return (
      <fabric-react-component class="ui primary action fluid text container" style={{paddingTop:'0'}}>
        <Form onSubmit={this.handleSubmit} size={this.props.size} method="POST">
          <Form.Field>
            <label>xprv</label>
            <input placeholder="xprv" name="xprv" autoComplete="xprv" value={xprv} onChange={this.handleSeedChange} />
          </Form.Field>
          <Form.Field>
            <label>xpub</label>
            <input placeholder="xpub" name="xpub" autoComplete="xpub" value={xpub} onChange={this.handleSeedChange} />
          </Form.Field>
          <Form.Field>
            <label>Seed Phrase</label>
            <input placeholder="Seed phrase" name="seed" autoComplete="seed" value={seed} onChange={this.handleSeedChange} />
          </Form.Field>
          <Form.Field>
            <label>Derivation Path</label>
            <input placeholder="derivation path" name="derivation" value={derivation} onChange={this.handleDerivationChange} />
          </Form.Field>
          <Button.Group vertical centered fluid>
            <Button fluid primary color='blue' icon labelPosition='right' loading={loading} type="submit" size={this.props.size}>Log In <Icon name='right chevron' /></Button>
            <Button fluid primary color='green' icon labelPosition='right' loading={loading} size={this.props.size}>Generate New <Icon name='leaf' /></Button>
            <Button fluid primary color='black' icon labelPosition='right' loading={loading} size={this.props.size}>Use Trezor <Icon name='lock' /></Button>
            {/* <Button as={Link} to='/' fluid icon labelPosition='left' size='small'><Icon name='left chevron' />Back to the Waitlist</Button> */}
          </Button.Group>
          {error && <Message error visible content={error} style={{ clear: 'both', marginTop: '1em' }} />} {/* Display error message if error state is not null */}
        </Form>
      </fabric-react-component>
    );
  }
}

module.exports = LoginForm;
