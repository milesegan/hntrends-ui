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
  handleSubmit:function(event) {
    event.preventDefault();
    var newTopics = this.state.topics;
    newTopics.length = 0;
    this.setState({ topics: newTopics });
    var query = this.refs.query.getDOMNode().value.trim();
    var topics = query.split(" ");
    topics.forEach(function(t)  {
      $.ajax({
        url: ("http://hntrend-api.globalonset.com/api/v0/topic/" + t + "?callback=callback"),
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(data)  {
          this.addTopic(data)
        }.bind(this)
      });
    }.bind(this))
  },
  render:function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "row"}, 
          React.createElement("form", {className: "form-inline", onSubmit: this.handleSubmit}, 
            React.createElement("input", {type: "text", placeholder: "Search Terms", className: "form-control", ref: "query"}), 
            React.createElement("input", {type: "submit", className: "btn btn-primary"})
          )
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement(Chart, {topics: this.state.topics})
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement(ChartLegend, {topics: this.state.topics})
        )
      )
    );
  }
});

React.renderComponent(
  React.createElement(HNTrendUI, null),
  document.getElementById('container')
);
