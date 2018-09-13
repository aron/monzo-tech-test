import {Component, h} from '../../vendor/preact.js';

export default class AppDirectory extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
