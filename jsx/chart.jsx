/** @jsx React.DOM */

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
    function convertDate(d) {
      return new Date(d * 1000 * 60 * 60 * 24);
    }
    var node = this.getDOMNode();
    node.innerHTML = "";
    var margin = 40;
    var data = this.props.topics[0].data;
    var box = node.getBoundingClientRect();
    var xScale = d3.time.scale()
      .domain([
        convertDate(d3.min(data, d => d[0])),
        convertDate(d3.max(data, d => d[0]))
      ])
      .range([margin, box.width - margin]);
    var yScale = d3.scale.linear()
      .domain([
        0,
        d3.max(data, d => d[1])
      ])
      .range([box.height - margin, margin]);
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
        .interpolate('linear');
      c.append('path')
        .attr('class', `trendline line-${line}`)
        .attr('d', lineFunc(t.data));
    });
  }
});
