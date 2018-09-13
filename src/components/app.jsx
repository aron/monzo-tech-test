import {Component, h} from '../../vendor/preact.js';
import {gettext} from '../utils.js';
import {verifyToken} from '../client.js';
import {logoutAction, loadAppsAction, updateAppAction, performLoginAction} from '../actions.js';
import {initialAppState} from '../store.js';

import AppDirectory from './app_directory.js';
import AppInfo from './app_info.js';
import LoginForm from './login_form.js';

/**
 * The primary controller for the application. The AppContainer holds all of the state
 * as well as interfacing with the server via "actions". The actions are functions
 * that take some input and return new state.
 */
export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = initialAppState();
    
    // TODO: Use babel plugin to support bound and static properties.
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAppChange = this.handleAppChange.bind(this);
  }

  componentDidMount() {
    if (this.state.authToken) {
      this.setupLoggedIn();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.authToken && !prevState.authToken) {
      this.setupLoggedIn();
    } else if (!this.state.authToken) {
      clearTimeout(this.pingTimer);
    }
  }

  /**
   * Start pinging the API every 30s to ensure our session is still valid. If not
   * we display a modal dialog and redirect the user back to the login form.
   */
  queueAuthPing() {
    if (!this.state.authToken) {
      return;
    }

    clearTimeout(this.pingTimer);
    this.pingTimer = setTimeout(() => {
      verifyToken(this.state.authToken).then(
        () => this.queueAuthPing(),
        () => this.state.authToken && this.setState(logoutAction(gettext('Your login has expired please log in again')))
      );
    }, 30 * 1000 /* 30s */)
  }

  setupLoggedIn() {
    this.handleLoadApps();
    this.queueAuthPing();
  }

  async handleLogin(credentials) {
    this.setState({authStatus: 'pending'});
    this.setState(await performLoginAction(credentials), () => {
      this.setupLoggedIn();
    });
  }

  async handleLoadApps() {
    if (this.state.authToken) {
      this.setState(await loadAppsAction(this.state.authToken));
    }
  }

  handleLogout() {
    this.setState(logoutAction());
  }

  async handleAppChange({id, name}) {
    // TODO: Loading/Error state etc.
    this.setState(await updateAppAction(this.state.authToken, id, {name}));
  }

  render() {
    return <App {...this.state} onAppChange={this.handleAppChange} onLogin={this.handleLogin} onLogout={this.handleLogout} />;
  }
}

class App extends Component {
  renderLogin() {
    const message = this.props.authStatus === 'error' ? gettext('Unable to log in with that email & password') : null;
    return (
      <div className="columns">
        <div className="column is-half">
          <LoginForm status={this.props.authStatus} message={message} onSubmit={this.props.onLogin} />
        </div>
      </div>
    );
  }

  renderAppDirectory() {
    const apps = Object.values(this.props.apps).map(app => <AppInfo key={app.id} {...app} onChange={this.props.onAppChange} />);
    return (
      <AppDirectory>{apps}</AppDirectory>
    );
  }

  render() {
    const content = this.props.authToken ? this.renderAppDirectory() : this.renderLogin();
    let loggedInNav = null;
    if (this.props.authToken) {
      loggedInNav = (
        <div className="navbar-end">
          <div className="navbar-item">
            <p className="control">
              <button className="button is-primary is-inverted" onClick={this.props.onLogout}>Logout</button>
            </p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <nav className="navbar is-primary">
          <div className="navbar-brand">
            <div className="navbar-item">Admin</div>
          </div>
          {loggedInNav}
        </nav>
        <div className="section">
          <div className="container">{content}</div>
        </div>
      </div>
    );
  }
}