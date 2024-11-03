'use strict';

module.exports = {
  accounts: {
    create: require('./accounts/create_account'),
    view: require('./accounts/view_account'),
    list: require('./accounts/list_accounts'),
    // destroy: require('./accounts/destroy_account'),
    // update: require('./accounts/update_account')
  },
  contracts: {
    create: require('./contracts/create_contract'),
    view: require('./contracts/view_contract'),
    list: require('./contracts/list_contracts'),
    // destroy: require('./contracts/destroy_contract'),
    // update: require('./contracts/update_contract')
  },
  conversations: {
    create: require('./conversations/create_conversation'),
    view: require('./conversations/view_conversation'),
    list: require('./conversations/list_conversations'),
    // destroy: require('./conversations/destroy_conversation'),
    // update: require('./conversations/update_conversation')
  },
  messages: {
    create: require('./messages/create_message'),
    view: require('./messages/view_message'),
    list: require('./messages/list_messages'),
    // destroy: require('./messages/destroy_message'),
    // update: require('./messages/update_message')
  },
  peers: {
    create: require('./peers/create_peer'),
    view: require('./peers/view_peer'),
    list: require('./peers/list_peers'),
    // destroy: require('./peers/destroy_peer'),
    // update: require('./peers/update_peer')
  },
  sessions: {
    create: require('./sessions/create_session'),
    view: require('./sessions/view_session'),
    list: require('./sessions/list_sessions'),
    // destroy: require('./sessions/destroy_session')
  },
  settings: {
    list: require('./settings/list_settings'),
    update: require('./settings/update_settings')
  }
};
