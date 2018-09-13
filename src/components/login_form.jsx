import {Component, h} from '../../vendor/preact.js';
import {uniqueId, gettext} from '../utils.js';

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
    return (
      <form key={id} className={`login login--${this.props.status}`} ref={el => this.form = el} onSubmit={this.handleSubmit}>
        {this.props.message ? <div className="notification is-warning">{this.props.message}</div> : null}
        <div className="field">
          <label className="label" for={`email-${id}`}>{gettext('Email:')}</label>
          <div className="control">
            <input key={`email-${id}`} id={`email-${id}`} className="input" type="email" name="email" placeholder={gettext('monzo@example.com')} />
          </div>
        </div>
        <div className="field">
          <label className="label" for={`password-${id}`}>{gettext('Password:')}</label>
          <div className="control">
            <input key={`password-${id}`} id={`password-${id}`} className="input" type="password" name="password" placeholder={'••••••••'} />
          </div>
        </div>
        <div className="field">
          <label className="label" for={`expires-${id}`}>{gettext('Keep me logged in for:')}</label>
          <div className="control">
            <div className="select">
              <select key={`expires-${id}`} id={`expires-${id}`} name="expiry">
                <option value="30s">{gettext('30 Seconds')}</option>
                <option value="1h">{gettext('1 Hour')}</option>
                <option value="1d">{gettext('1 Day')}</option>
                <option value="30d" selected>{gettext('30 Days')}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className={`button is-primary ${isLoading ? 'is-loading': ''}`} type="submit" disabled={isLoading}>Login</button>
          </div>
        </div>
      </form>
    );
  }
}

LoginForm.defaultProps = {
  onSubmit: () => null,
};