function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import { Component, h } from '../../vendor/preact.js';
import { gettext } from '../utils.js';
import { verifyToken } from '../client.js';
import { logoutAction, loadAppsAction, updateAppAction, performLoginAction } from '../actions.js';
import { initialAppState } from '../store.js';
import AppDirectory from './app_directory.js';
import AppInfo from './app_info.js';
import LoginForm from './login_form.js';
export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = initialAppState(); // TODO: Use babel plugin to support bound and static properties.

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

  queueAuthPing() {
    if (!this.state.authToken) {
      return;
    }

    clearTimeout(this.pingTimer);
    this.pingTimer = setTimeout(() => {
      verifyToken(this.state.authToken).then(() => this.queueAuthPing(), () => this.state.authToken && this.setState(logoutAction(gettext('Your login has expired please log in again'))));
    }, 30 * 1000
    /* 30s */
    );
  }

  setupLoggedIn() {
    this.handleLoadApps();
    this.queueAuthPing();
  }

  async handleLogin(credentials) {
    this.setState({
      authStatus: 'pending'
    });
    this.setState((await performLoginAction(credentials)), () => {
      this.setupLoggedIn();
    });
  }

  async handleLoadApps() {
    if (this.state.authToken) {
      this.setState((await loadAppsAction(this.state.authToken)));
    }
  }

  handleLogout() {
    this.setState(logoutAction());
  }

  async handleAppChange({
    id,
    name
  }) {
    // TODO: Loading/Error state etc.
    this.setState((await updateAppAction(this.state.authToken, id, {
      name
    })));
  }

  render() {
    return h(App, _extends({}, this.state, {
      onAppChange: this.handleAppChange,
      onLogin: this.handleLogin,
      onLogout: this.handleLogout
    }));
  }

}

class App extends Component {
  renderLogin() {
    const message = this.props.authStatus === 'error' ? gettext('Unable to log in with that email & password') : null;
    return h("div", {
      className: "columns"
    }, h("div", {
      className: "column is-half"
    }, h(LoginForm, {
      status: this.props.authStatus,
      message: message,
      onSubmit: this.props.onLogin
    })));
  }

  renderAppDirectory() {
    const apps = Object.values(this.props.apps).map(app => h(AppInfo, _extends({
      key: app.id
    }, app, {
      onChange: this.props.onAppChange
    })));
    return h(AppDirectory, null, apps);
  }

  render() {
    const content = this.props.authToken ? this.renderAppDirectory() : this.renderLogin();
    let loggedInNav = null;

    if (this.props.authToken) {
      loggedInNav = h("div", {
        className: "navbar-end"
      }, h("div", {
        className: "navbar-item"
      }, h("p", {
        className: "control"
      }, h("button", {
        className: "button is-primary is-inverted",
        onClick: this.props.onLogout
      }, "Logout"))));
    }

    return h("div", null, h("nav", {
      className: "navbar is-primary"
    }, h("div", {
      className: "navbar-brand"
    }, h("div", {
      className: "navbar-item"
    }, "Admin")), loggedInNav), h("div", {
      className: "section"
    }, h("div", {
      className: "container"
    }, content)));
  }

}

//# sourceMappingURL=app.js.map