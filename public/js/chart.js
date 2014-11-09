/** @jsx React.DOM */

var ChartLegend = React.createClass({displayName: 'ChartLegend',
  render:function() {
    if (this.props.topics.length < 1) {
      return (React.createElement("div", null));
    }

    var topics = this.props.topics.sort(function(a, b)  {
      if (a.topic < b.topic) return -1;
      return 1;
    });
    var items = topics.map(function(t, i)  {
      var classes = ("legend-box line-" + (i % 5));
      return (
      React.createElement("div", {className: "legend-item"}, 
        React.createElement("span", {className: classes}, " "), 
        React.createElement("span", {className: "legend-title"}, t.topic)
      )
      );
    });
    return (React.createElement("div", {className: "legend col-md-12"}, items));
  }
});

var Chart = React.createClass({displayName: 'Chart',
  componentDidUpdate:function() {
    this._updateChart();
  },
  componentWillUnmount:function() {
    var el = this.getDOMNode();
    d3.destroy(el);
  },
  render:function() {
    return (React.createElement("svg", {height: "300", className: "chart col-md-12"}));
  },
  shouldComponentUpdate:function() {
    this._updateChart();
    return false;
  },
  _updateChart:function() {
    if (this.props.topics.length < 1) {
      return;
    }
    function convertDate(d) {
      return new Date(d * 1000 * 60 * 60 * 24);
    }
    var node = this.getDOMNode();
    node.innerHTML = "";
    var margin = 40;
    var box = node.getBoundingClientRect();
    var minX = d3.min(this.props.topics, function(t)  {return d3.min(t.data, function(d)  {return d[0];});});
    var maxX = d3.max(this.props.topics, function(t)  {return d3.max(t.data, function(d)  {return d[0];});});
    var xScale = d3.time.scale()
      .domain([
        convertDate(minX),
        convertDate(maxX)
      ])
      .range([margin, box.width - margin]);
    var maxY = d3.max(this.props.topics, function(t)  {return d3.max(t.data, function(d)  {return d[1];});});
    var yScale = d3.scale.linear()
      .domain([0, maxY])
      .range([box.height - margin, margin])
      .nice();
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
        .x(function(d)  {return xScale(convertDate(d[0]));})
        .y(function(d)  {return yScale(d[1]);})
        .interpolate('basis');
      c.append('path')
        .attr('class', ("trendline line-" + line))
        .attr('d', lineFunc(t.data));
    });
  }
});
