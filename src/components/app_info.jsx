import {Component, h} from '../../vendor/preact.js';

export default class AppInfo extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.setState({isLoading: false});
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const form = evt.target;
    const newName = form.elements.name.value;
    if (this.props.name !== newName) {
      this.props.onChange({id: this.props.id, name: newName});
      this.setState({isLoading: true});
    }
  }

  render() {
    const {name, created, logo} = this.props;
    return (
      <article className="media">
        <figure className="media-left">
          <div className="image is-64x64">
            <img src={logo} />
          </div>
        </figure>
        <div className="media-content">
          <form className={`control ${this.state.isLoading ? 'is-loading' : ''}`} onSubmit={this.handleSubmit}>
            <input className="input" type="text" name="name" defaultValue={name} />
            <p className="help">Created on <time dateTime={created}>{new Date(created).toLocaleDateString()}</time></p>
          </form>
        </div>
      </article>
    );
  }
}

AppInfo.defaultProps = {
  onChange: () => {},
}