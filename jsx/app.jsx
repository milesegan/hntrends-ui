/** @jsx React.DOM */

var TopicView = React.createClass({
  render() {
    var timePoints = this.props.topic.data.map((i) => {
      return (<li>{i}</li>);
    });
    return (
      <ul>
      {timePoints}
      </ul>
    );
  }
});

var HNTrendUI = React.createClass({
  getInitialState() {
    return {
      topics: [{
        topic: "Apple",
        data: []
      }]
    }
  },
  componentDidMount() {
    $.get("http://hn.globalonset.com/api/v0/topic/apple", null, (data) => {
      this.setState({ topics: [data] });
    });
    console.log('component mounted');
  },
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <h2>{this.state.topics[0].topic}</h2>
        <TopicView topic={this.state.topics[0]}/>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
