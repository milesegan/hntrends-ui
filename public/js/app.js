/** @jsx React.DOM */

var HNTrendUI = React.createClass({displayName: 'HNTrendUI',
  addTopic:function(data) {
    var newTopics = this.state.topics;
    newTopics.push(data);
    this.setState({topics: newTopics});
  },
  getInitialState:function() {
    return {
      topics: []
    }
  },
  componentDidMount:function() {
    var topics = ["apple", "google", "microsoft"];
    topics.forEach(function(t)  {
      $.get(("http://hn.globalonset.com/api/v0/topic/" + t),
        null,
        function(data)  {
          this.addTopic(data)
        }.bind(this));
    }.bind(this));
  },
  render:function() {
    var topicNames = this.state.topics.map(function(i)  {return i.topic;}).sort().join(", ");
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "row"}, 
          React.createElement("h1", {className: "col-md-12"}, topicNames)
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement(Chart, {topics: this.state.topics})
        )
      )
    );
  }
});

React.renderComponent(
  React.createElement(HNTrendUI, null),
  document.getElementById('container')
);
