import { Component, h } from '../../vendor/preact.js';
import { uniqueId, gettext } from '../utils.js';
export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const fields = evt.target.elements;
    this.props.onSubmit({
      email: fields.email.value,
      password: fields.password.value,
      expiry: fields.expiry.value
    });
  }

  render() {
    const id = uniqueId();
    const isLoading = this.props.status === 'pending';
    return h("form", {
      key: id,
      className: `login login--${this.props.status}`,
      ref: el => this.form = el,
      onSubmit: this.handleSubmit
    }, this.props.message ? h("div", {
      className: "notification is-warning"
    }, this.props.message) : null, h("div", {
      className: "field"
    }, h("label", {
      className: "label",
      "for": `email-${id}`
    }, gettext('Email:')), h("div", {
      className: "control"
    }, h("input", {
      key: `email-${id}`,
      id: `email-${id}`,
      className: "input",
      type: "email",
      name: "email",
      placeholder: gettext('monzo@example.com')
    }))), h("div", {
      className: "field"
    }, h("label", {
      className: "label",
      "for": `password-${id}`
    }, gettext('Password:')), h("div", {
      className: "control"
    }, h("input", {
      key: `password-${id}`,
      id: `password-${id}`,
      className: "input",
      type: "password",
      name: "password",
      placeholder: '••••••••'
    }))), h("div", {
      className: "field"
    }, h("label", {
      className: "label",
      "for": `expires-${id}`
    }, gettext('Keep me logged in for:')), h("div", {
      className: "control"
    }, h("div", {
      className: "select"
    }, h("select", {
      key: `expires-${id}`,
      id: `expires-${id}`,
      name: "expiry"
    }, h("option", {
      value: "30s"
    }, gettext('30 Seconds')), h("option", {
      value: "1h"
    }, gettext('1 Hour')), h("option", {
      value: "1d"
    }, gettext('1 Day')), h("option", {
      value: "30d",
      selected: true
    }, gettext('30 Days')))))), h("div", {
      className: "field"
    }, h("div", {
      className: "control"
    }, h("button", {
      className: `button is-primary ${isLoading ? 'is-loading' : ''}`,
      type: "submit",
      disabled: isLoading
    }, "Login"))));
  }

}
LoginForm.defaultProps = {
  onSubmit: () => null
};

//# sourceMappingURL=login_form.js.map