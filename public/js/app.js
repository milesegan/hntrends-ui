/** @jsx React.DOM */

var Chart = React.createClass({displayName: 'Chart',
  componentDidMount:function() {
  },
  componentDidUpdate:function() {
    this.updateChart();
  },
  componentWillUnmount:function() {
    var el = this.getDOMNode();
    d3.destroy(el);
  },
  render:function() {
    return (React.createElement("svg", {height: "400", className: "chart col-md-12"}));
  },
  shouldComponentUpdate:function() {
    this.updateChart();
    return false;
  },
  updateChart:function() {
    var node = this.getDOMNode();
    node.innerHTML = "";
    var margin = 40;
    var data = this.props.topics[0].data;
    var minX = d3.min(data, function(d)  {return d[0];});
    var maxX = d3.max(data, function(d)  {return d[0];});
    var maxY = d3.max(data, function(d)  {return d[1];});
    var box = node.getBoundingClientRect();
    var xScale = d3.scale.linear().domain([minX, maxX]).range([margin, box.width - margin]);
    var yScale = d3.scale.linear().domain([0, maxY]).range([box.height - margin, margin]);
    var c = d3.select(node);
    var xAxis = d3.svg.axis()
      .scale(xScale);
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(10)
      .orient('left');
    c.append('g')
      .attr('class', 'x axis')
      .attr('transform', ("translate(0, " + (box.height - margin) + ")"))
      .call(xAxis);
    c.append('g')
      .attr('class', 'y axis')
      .attr('transform', ("translate(" + margin + ",0)"))
      .call(yAxis);
    this.props.topics.forEach(function(t,i)  {
      var line = i % 7;
      var lineFunc = d3.svg.line()
        .x(function(d)  {return xScale(d[0]);})
        .y(function(d)  {return yScale(d[1]);})
        .interpolate('linear');
      c.append('path')
        .attr('class', ("trendline line-" + line))
        .attr('d', lineFunc(t.data));
    });
  }
});

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
    var topicNames = this.state.topics.map(function(i)  {return i.topic;}).join(", ");
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
