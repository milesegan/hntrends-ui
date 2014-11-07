/** @jsx React.DOM */

var HNTrendUI = React.createClass({
  addTopic(data) {
    var newTopics = this.state.topics;
    newTopics.push(data);
    this.setState({topics: newTopics});
  },
  getInitialState() {
    return {
      topics: []
    }
  },
  componentDidMount() {
    var topics = ["apple", "google", "microsoft"];
    topics.forEach(t => {
      $.get(`http://hn.globalonset.com/api/v0/topic/${t}`,
        null,
        (data) => {
          this.addTopic(data)
        });
    });
  },
  render() {
    var topicNames = this.state.topics.map(i => i.topic).sort().join(", ");
    return (
      <div>
        <div className='row'>
          <h1 className="col-md-12">{topicNames}</h1>
        </div>
        <div className='row'>
          <Chart topics={this.state.topics}/>
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
