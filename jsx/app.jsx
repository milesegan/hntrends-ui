/** @jsx React.DOM */

var Chart = React.createClass({
  componentDidMount() {
  },
  componentDidUpdate() {
    this.updateChart();
  },
  componentWillUnmount() {
    var el = this.getDOMNode();
    d3.destroy(el);
  },
  render() {
    return (<svg height='400' className="chart col-md-12"></svg>);
  },
  shouldComponentUpdate() {
    this.updateChart();
    return false;
  },
  updateChart() {
    var node = this.getDOMNode();
    node.innerHTML = "";
    var margin = 40;
    var box = node.getBoundingClientRect();
    var maxX = d3.max(this.props.data, d => d.x);
    var maxY = d3.max(this.props.data, d => d.y);
    var xScale = d3.scale.linear().domain([0, maxX]).range([margin, box.width - margin]);
    var yScale = d3.scale.linear().domain([0, maxY]).range([box.height - margin, margin]);
    var c = d3.select(node);
    var xAxis = d3.svg.axis()
      .scale(xScale);
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .ticks(10)
      .orient('left');
    var lineFunc = d3.svg.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .interpolate('linear');
    c.append('path')
      .attr('d', lineFunc(this.props.data))
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('fill', 'none');
    c.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${box.height - margin})`)
      .call(xAxis);
    c.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin},0)`)
      .call(yAxis);
  }
});

var HNTrendUI = React.createClass({
  getInitialState() {
    var sampleData = [
      {x: 0, y: 1},
      {x: 1, y: 2},
      {x: 2, y: 20},
      {x: 3, y: 10},
      {x: 4, y: 4}
    ];
    return {
      data: sampleData,
      domain: {x: [0, 30], y: [0, 100]}
    }
  },
  componentDidMount() {
    $.get("http://hn.globalonset.com/api/v0/topic/apple",
      null,
      (data) => { this.setState({topics: [data]}); });
    console.log('component mounted');
  },
  render() {
    return (
      <div className='row'>
        <Chart data={this.state.data} domain={this.state.domain}/>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
