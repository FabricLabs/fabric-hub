'use strict';

// Dependencies
const React = require('react');
const { Link, Navigate, Route, Routes, Switch, useLocation, useParams, useNavigate } = require('react-router-dom');
const { ToastContainer, toast, Slide } = require('react-toastify');
const { helpMessageToastEmitter, helpMessageSound } = require('../functions/toastifyProps.js')

// const LoadingBar = require('react-top-loading-bar');

// Semantic UI
const {
  Container,
  Header,
  Icon,
  Image,
  Label,
  Menu,
  Popup,
  Sidebar,
} = require('semantic-ui-react');

// Constants
const {
  BRAND_NAME,
  RELEASE_NAME,
  RELEASE_DESCRIPTION,
  ENABLE_ALERTS,
  ENABLE_CHANGELOG,
  ENABLE_DOCUMENTS,
  ENABLE_NETWORK,
  ENABLE_TASKS,
  ENABLE_UPLOADS,
  ENABLE_WALLET,
  USER_HINT_TIME_MS,
  ENABLE_PERSON_SEARCH
} = require('../constants');

// Components
const Home = require('./Home');
const ContractHome = require('./ContractHome');
const NetworkHome = require('./NetworkHome');
const Library = require('./Library');
const DocumentHome = require('./DocumentHome');
const DocumentView = require('./DocumentView');
const UserView = require('./UserView');
const Changelog = require('./Changelog');
const Settings = require('./Settings');
// const AdminSettings = require('./AdminSettings');
const TermsOfUse = require('./TermsOfUse');

// Fabric Bridge
const Bridge = require('./Bridge');

/**
 * The main dashboard component.
 */
class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // Initial Settings and Defaults
    this.settings = Object.assign({
      debug: false,
      state: {
        loading: false,
        username: '(guest account)',
        search: '',
        sidebarCollapsed: false,
        sidebarVisible: true,
        progress: 0,
        isLoading: true,
        isLoggingOut: false,
        steps: [
          {
            target: '.my-first-step',
            content: 'This is my awesome feature!',
          },
          {
            target: '.my-other-step',
            content: 'This another awesome feature!',
          }
        ]
      }
    }, props);

    this.state = this.settings.state;
  }

  ref = () => {
    return React.createRef()
  }

  clickSelfIcon = () => {
    return (<Navigate to='/settings' />);
  }

  componentDidMount () {
    const { location, params, navigate } = this.props;
    const { isAdmin } = this.props.auth;
    // this.startProgress();

    // $('.ui.sidebar').sidebar();

    // Simulate a loading delay
    setTimeout(() => {
      // this.completeProgress();
      this.setState({ isLoading: false });
    }, 250);

    if (isAdmin) {
      this.props.syncRedisQueue();
    }
  }

  handleLogout = () => {
    this.setState({
      loading: true,
      isLoggingOut: true
    });

    setTimeout(() => {
      this.props.onLogoutSuccess();
      this.setState({
        loading: false,
        isLoggingOut: false
      });
    }, 500);
  };

  // TODO: review and determine what to do with this function
  // handleSettings = () => {}

  startProgress = () => {
    this.intervalId = setInterval(() => {
      this.setState(prevState => ({
        progress: prevState.progress + 1,
      }), () => {
        if (this.state.progress >= 100) {
          this.completeProgress();
          this.setState({ isLoading: false });
          clearInterval(this.intervalId);
        } else {
          this.ref.current.continuousStart();
        }
      });
    }, 5);
  };

  completeProgress = () => {
    this.ref.current.complete();
  };

  handleSearchChange = (e) => {
    console.log('search change:', e);
    this.setState({ search: e.target.value });
  };

  //this is the handler that sets which section is opened in the section bar in the left
  handleMenuItemClick = (menu) => {
    const newState = {
      openLibrary: false,
      openConversations: false,
    };

    // Update the state based on the menu item clicked
    switch (menu) {
      case 'home':
        this.setState({ openSectionBar: false });
        this.props.resetChat();
        break;
      case 'library':
        if (this.state.openLibrary && this.state.openSectionBar) {
          this.setState({ openSectionBar: false });
          newState.openLibrary = true;
        } else {
          newState.openLibrary = true;
          this.setState({ openSectionBar: true });
          if (!this.state.openLibrary) {
            this.props.resetChat();
          }
        }
        break;
      default:
        console.error('Unknown menu item');
        return;
    }

    // Set the new state
    this.setState(newState);
  };

  responseCapture = (action) => {
    const { id, isAdmin } = this.props.auth;
    const sound = new Audio(helpMessageSound);

    if (id == action.creator) {
      if (action.type == 'IngestFile') {
        if (action.completed) {
          toast(<p>Your file <b>{action.filename}</b> has been ingested! </p>, helpMessageToastEmitter);
        }
        this.props.fetchUserFiles(id);
      }

      if (action.type == 'IngestDocument' && isAdmin) {
        toast(<p>Your document "{action.title}"" has been ingested!  You can check it <a href={`${window.location.protocol}//${window.location.hostname}:${window.location.port}/documents/${action.fabric_id}`}>Here</a></p>, helpMessageToastEmitter);
      }
    }

    if (action.type == 'takenJob') {
      this.props.lastJobTaken(action.job);
      if (isAdmin) {
        this.props.syncRedisQueue();
      }
    }

    if (action.type == 'completedJob') {
      action.job.status = action.status;
      this.props.lastJobCompleted(action.job);
      if (isAdmin) {
        this.props.syncRedisQueue();
      }
    }
  }

  captureFileUpload = (action) => {
    toast('a file has finishing uploading', helpMessageToastEmitter);
  }

  render () {
    const USER_IS_ADMIN = this.props.auth.isAdmin || false;
    const USER_IS_ALPHA = this.props.auth.isAlpha || false;
    const USER_IS_BETA = this.props.auth.isBeta || false;
    const {
      openSectionBar
    } = this.state;

    // const sidebarStyle = this.state.sidebarCollapsed ? { width: 'auto', position: 'relative' } : {position: 'relative'};
    const sidebarStyle = {
      minWidth: '300px',
      maxWidth: '300px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowY: 'auto',
      scrollbarGutter: 'stable both-edges',
    };

    const containerStyle = {
      margin: '1em 1em 0 1em',
      marginLeft: openSectionBar ? '1em' : 'calc(-300px + 1em)',
      transition: 'margin-left 0.5s ease-in-out',
      maxHeight: '97vh',
    };

    return (
      <sensemaker-dashboard style={{ height: '100%' }} className='fade-in'>
        {/* <LoadingBar color="#f11946" progress={this.state.progress} /> */}
        {/* <Joyride steps={this.state.steps} /> */}
        {/* <div id="sidebar" attached="bottom" style={{ overflow: 'hidden', borderRadius: 0, height: '100vh', backgroundColor: '#eee' }}> */}
        <div attached="bottom" style={{ overflowX: 'hidden', borderRadius: 0, height: '100vh', backgroundColor: '#ffffff', display: 'flex' }}>
          {/* Small sidebar to the left, with the icons, always visible */}
          <Sidebar as={Menu} id="main-sidebar" animation='overlay' icon='labeled' inverted vertical visible size='huge' style={{ overflow: 'hidden' }} onClick={() => { this.toggleInformationSidebar(); this.closeHelpBox(); }}>
            <div>
              <Menu.Item as={Link} to="/" onClick={() => this.handleMenuItemClick('home')}>
                <Icon name='home' size='large' />
                <p className='icon-label'>Home</p>
              </Menu.Item>
              {ENABLE_TASKS && USER_IS_ALPHA && (
                <Menu.Item as={Link} to='/tasks' onClick={() => this.handleMenuItemClick('tasks')} className='expand-menu'>
                  <div className='col-center'>
                    <Icon name='tasks' size='large' />
                    <p className='icon-label'>Tasks</p>
                  </div>
                </Menu.Item>
              )}
              {ENABLE_NETWORK && (
                <Menu.Item as={Link} to='/peers' onClick={this.closeSidebars}>
                  <Icon name='globe' size='large'/>
                  <p className='icon-label'>Network</p>
                </Menu.Item>
              )}
              {ENABLE_ALERTS && (
                <Menu.Item as={Link} to='/alerts' onClick={() => this.handleMenuItemClick('alerts')} className='expand-menu'>
                  <div className='col-center'>
                    <Icon name='bell' size='large' />
                    <p className='icon-label'>Alerts</p>
                  </div>
                </Menu.Item>
              )}
            </div>
            <div style={{ flexGrow: 1 }}></div> {/* Spacer */}
            {/* {!this.state.openSectionBar && (
              <div className='expand-sidebar-arrow'>
                <Icon id='expand-sidebar-icon' name='caret right' size='large' white style={{ cursor: 'pointer' }} onClick={() => this.setState({ openSectionBar: true })} />
              </div>
            )} */}
            <div>
              {ENABLE_CHANGELOG && (
                <Menu.Item as={Link} to='/updates' onClick={this.closeSidebars}>
                  <Icon name='announcement' size='large' />
                  <p className='icon-label'>News</p>
                </Menu.Item>
              )}
              {(this.props.auth.isAdmin) ? (
                <Menu.Item as={Link} to="/settings/admin" id='adminItem' onClick={this.closeSidebars}>
                  <Icon name='key' size='large' />
                  <p className='icon-label'>Admin</p>
                </Menu.Item>) : null}
              {ENABLE_WALLET && (
                <Menu.Item as={Link} to='/wallets' onClick={() => this.handleMenuItemClick('wallets')} className='expand-menu'>
                  <div className='col-center'>
                    <Icon name='bitcoin' size='large' />
                    <p className='icon-label'>Wallet</p>
                  </div>
                </Menu.Item>
              )}
              <div className='settings-menu-container'>
                <Menu.Item as={Link} to="/settings" id='settingsItem' onClick={this.closeSidebars}>
                  <Icon name='cog' size='large' />
                  <p className='icon-label'>Settings</p>
                </Menu.Item>
              </div>
            </div>
          </Sidebar>
          <Sidebar as={Menu} animation='overlay' id="collapse-sidebar" icon='labeled' inverted vertical visible={openSectionBar} style={sidebarStyle} size='huge' onClick={() => { this.toggleInformationSidebar(); this.closeHelpBox(); }}>
            <div className='collapse-sidebar-arrow'>
              <Icon name='caret left' size='large' white className='fade-in' style={{ cursor: 'pointer' }} onClick={() => this.setState({ openSectionBar: false })} />
            </div>
            <Menu.Item as={Link} to="/" style={{ paddingBottom: '0em', marginTop: '-1.5em' }}
              onClick={() => { this.setState({ openSectionBar: false }); this.props.resetChat() }}>
              <Header className='dashboard-header'>
                <div>
                  <div>
                    <Popup trigger={<Icon name='circle' color='green' size='tiny' />}>
                      <Popup.Content>disconnected</Popup.Content>
                    </Popup>
                    <Popup trigger={<Label color='black' style={{ borderColor: 'transparent', backgroundColor: 'transparent' }}>{RELEASE_NAME}</Label>}>
                      <Popup.Content>{RELEASE_DESCRIPTION}</Popup.Content>
                    </Popup>
                  </div>
                </div>
              </Header>
            </Menu.Item>
            <div style={{ flexGrow: 1 }}></div> {/* Spacer */}
            <section>
              <Menu.Item style={{ borderBottom: 0 }}>
                <Bridge responseCapture={this.responseCapture} />
                <p style={{ marginTop: '2em' }}><small className="subtle">@FabricLabs</small></p>
                {this.state.debug && <p><Label><strong>Status:</strong> {this.props.status || 'disconnected'}</Label></p>}
              </Menu.Item>
            </section>
          </Sidebar>
          <Container fluid style={containerStyle} onClick={this.closeSidebars}>
            {this.state.debug ? (
              <div>
                <strong><code>isAdmin</code>:</strong> <span>{(this.props.isAdmin) ? 'yes' : 'no'}</span><br />
                <strong><code>isCompliant</code>:</strong> <span>{(this.props.isCompliant) ? 'yes' : 'no'}</span><br />
                <strong><code>auth</code>:</strong> <code>{(this.props.auth) ? JSON.stringify(this.props.auth, null, '  ') : 'undefined'}</code>
                {/* <strong><code>state.auth.isAdmin</code></strong> <span>{this.state.auth.isAdmin}</span>
                <strong><code>state.auth.isCompliant</code></strong> <span>{this.state.auth.isCompliant}</span> */}
              </div>
            ) : null}
            {this.state.isLoading ? null : (
              <Routes>
                <Route path="*" element={<Navigate to='/' replace />} />
                <Route path="/" element={<Home auth={this.props.auth} />} />
                <Route path='/settings/library' element={<Library />} />
                <Route path="/updates" element={<Changelog {...this.props} />} />
                <Route path="/documents" element={<DocumentHome documents={this.props.documents} uploadDocument={this.props.uploadDocument} fetchDocuments={this.props.fetchDocuments} searchDocument={this.props.searchDocument} chat={this.props.chat} resetChat={this.props.resetChat} files={this.props.files} uploadFile={this.props.uploadFile} />} />
                <Route path="/documents/:fabricID" element={<DocumentView  {...this.props} documents={this.props.documents} fetchDocument={this.props.fetchDocument} resetChat={this.props.resetChat} />} />
                <Route path="/users/:username" element={<UserView {...this.props} />} />
                <Route path="/settings" element={<Settings {...this.props} auth={this.props.auth} login={this.props.login} />} />
                <Route path="/peers" element={<NetworkHome {...this.props} network={{ peers: [] }} />} />
                <Route path="/contracts" element={<ContractHome {...this.props} fetchContract={this.props.fetchContract} fetchContracts={this.props.fetchContracts} />} />
                <Route path="/contracts/terms-of-use" element={<TermsOfUse {...this.props} fetchContract={this.props.fetchContract} />} />
              </Routes>
            )}
          </Container>
        </div>
        <ToastContainer />
      </sensemaker-dashboard>
    );
  }
}

function dashboard (props) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  return <Dashboard {...{ location, navigate, params }} {...props} />
}

module.exports = dashboard;
