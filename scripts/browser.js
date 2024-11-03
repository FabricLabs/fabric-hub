// # Browser
// This file runs in the browser, and is responsible for rendering the UI.

// ## Overview
'use strict';

// Dependencies
const React = require('react');
const ReactDOM = require('react-dom/client');
const { Provider, connect } = require('react-redux');

// Fabric Components
// const FabricChatBar = require('@fabric/http/components/FabricChatBar');

// Functions
const toRelativeTime = require('../functions/toRelativeTime');

// Components
const HubUI = require('../components/HubUI');

// Settings
const settings = {
  currency: 'BTC'
};

// Redux
const store = require('../stores/redux');
const actions = require('../actions');

// ## Main Process
async function main (input = {}) {
  console.log('[FABRIC:HUB] main() executing...');

  // ### Custom HTML Elements
  // customElements.define('fabric-chat-bar', FabricChatBar);

  // ### Event Listeners
  window.addEventListener('load', async () => {
    console.debug('[HUB]', 'Window loaded!');
    // TODO: restore fabric-chat-bar
    // TODO: consider localforage
    // TODO: consider schema from Knex / MySQL
    // TODO: consider GraphQL to pass schema
    // const chatbar = document.createElement('fabric-chat-bar');
    // chatbar.style = 'position: absolute; bottom: 1em;';
    // document.body.append(chatbar);
  });

  // ### React Application
  // #### Connect Actions (Redux)
  // TODO: migrate this to `functions/mapStateToProps.js`?
  const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      chat: state.chat,
      accounts: state.accounts,
      contracts: state.contracts,
      conversation: state.conversations.conversation,
      conversations: state.conversations.conversations,
      conversationsLoading: state.conversations.loading,
      documents: state.documents,
      files: state.files,
      error: state.auth.error,
      inquiries: state.inquiries,
      invitation: state.invitation,
      isAuthenticated: state.auth.isAuthenticated,
      isAdmin: state.auth.isAdmin,
      isCompliant: state.auth.isCompliant,
      isSending: state.chat.isSending,
      token: state.auth.token,
      stats: state.stats,
      search: state.search,
      feedback: state.feedback,
      help: state.help
    }
  };

  console.debug('[HUB]', 'Connecting UI...');
  const connector = connect(mapStateToProps, actions);
  const ConnectedUI = connector(HubUI);

  // ### DOM Attachment
  // Render
  // TODO: render to `fabric-application-target`?
  const container = document.getElementById('application-target');
  const root = ReactDOM.createRoot(container);

  console.debug('[HUB]', 'Rendering UI...');
  root.render(
    <Provider store={store}>
      <ConnectedUI />
    </Provider>
  );

  // Updates (1s)
  setInterval(() => {
    document.querySelectorAll('abbr.relative-time').forEach((el) => {
      el.innerHTML = toRelativeTime(el.getAttribute('title'));
    });
  }, 1000); // 1 second

  // Return
  return {
    // react: { root }
  }
}

// Run Main Process
main(settings).catch((exception) => {
  console.error('[FABRIC:HUB] Main Process Exception:', exception);
}).then((output) => {
  console.log('[FABRIC:HUB] Main Process Output:', output);
});
