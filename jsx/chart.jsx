/** @jsx React.DOM */

var ChartLegend = React.createClass({
  render() {
    if (this.props.topics.length < 1) {
      return (<div></div>);
    }

    var items = this.props.topics.map((t, i) => {
      var classes = `legend-box line-${i % 5}`;
      return (
      <div className="legend-item">
        <span className={classes}>&nbsp;</span>
        <span className="legend-title">{t.topic}</span>
      </div>
      );
    });
    return (<div className="legend col-md-12">{items}</div>);
  }
});

var Chart = React.createClass({
  componentDidUpdate() {
    this._updateChart();
  },
  componentWillUnmount() {
    var el = this.getDOMNode();
    d3.destroy(el);
  },
  render() {
    return (<svg height='300' className="chart col-md-12"></svg>);
  },
  shouldComponentUpdate() {
    this._updateChart();
    return false;
  },
  _updateChart() {
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
    var minX = d3.min(this.props.topics, t => d3.min(t.data, d => d[0]));
    var maxX = d3.max(this.props.topics, t => d3.max(t.data, d => d[0]));
    var xScale = d3.time.scale()
      .domain([
        convertDate(minX),
        convertDate(maxX)
      ])
      .range([margin, box.width - margin]);
    var maxY = d3.max(this.props.topics, t => d3.max(t.data, d => d[1]));
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
      .attr('transform', `translate(0, ${box.height - margin})`)
      .call(xAxis);
    c.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin},0)`)
      .call(yAxis);
    this.props.topics.forEach((t,i) => {
      var line = i % 7;
      var lineFunc = d3.svg.line()
        .x(d => xScale(convertDate(d[0])))
        .y(d => yScale(d[1]))
        .interpolate('basis');
      c.append('path')
        .attr('class', `trendline line-${line}`)
        .attr('d', lineFunc(t.data));
    });
  }
});
