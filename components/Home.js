'use strict';

// Dependencies
const React = require('react');
const { useLocation } = require('react-router-dom');

const {
  Card,
  Header,
  Segment
} = require('semantic-ui-react');

const MenuBar = require('./MenuBar');

class Home extends React.Component {
  componentDidUpdate (prevProps) {
    if (this.props.location?.key !== prevProps.location?.key) {
      // console.debug('[!!!]', 'location changed:', this.props.location, '!==', prevProps.location);
      this.setState({
        chat: {
          message: null,
          messages: []
        },
        message: null
      });
    }
  }

  render () {
    return (
      <sensemaker-home class='fade-in' style={{ marginRight: '1em' }}>
        <Segment fluid style={{ clear: 'both' }}>
          <Header as='h1'>Welcome home, <abbr>{this.props.auth.username}</abbr>.</Header>
          <p>You have <strong>{this.props.unreadMessageCount || 0}</strong> unread messages.</p>
        </Segment>
      </sensemaker-home>
    );
  }
}

function HomeWithLocation (props) {
  const location = useLocation();
  return <Home {...props} location={location} />;
}

module.exports = HomeWithLocation;
