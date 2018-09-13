import { Component, h } from '../../vendor/preact.js';
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
      this.setState({
        isLoading: false
      });
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const form = evt.target;
    const newName = form.elements.name.value;

    if (this.props.name !== newName) {
      this.props.onChange({
        id: this.props.id,
        name: newName
      });
      this.setState({
        isLoading: true
      });
    }
  }

  render() {
    const {
      name,
      created,
      logo
    } = this.props;
    return h("article", {
      className: "media"
    }, h("figure", {
      className: "media-left"
    }, h("div", {
      className: "image is-64x64"
    }, h("img", {
      src: logo
    }))), h("div", {
      className: "media-content"
    }, h("form", {
      className: `control ${this.state.isLoading ? 'is-loading' : ''}`,
      onSubmit: this.handleSubmit
    }, h("input", {
      className: "input",
      type: "text",
      name: "name",
      defaultValue: name
    }), h("p", {
      className: "help"
    }, "Created on ", h("time", {
      dateTime: created
    }, new Date(created).toLocaleDateString())))));
  }

}
AppInfo.defaultProps = {
  onChange: () => {}
};

//# sourceMappingURL=app_info.js.map