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
    return (<svg width='200' height='200' className="chart"></svg>);
  },
  shouldComponentUpdate() {
    this.updateChart();
    return false;
  },
  updateChart() {
    var c = d3.select(this.getDOMNode());
    var lineFunc = d3.svg.line()
      .x(d => d.x * 10)
      .y(d => d.y * 5)
      .interpolate('linear');
    c.append('path')
      .attr('d', lineFunc(this.props.data))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }
});

var HNTrendUI = React.createClass({
  getInitialState() {
    var sampleData = [
      {x: 1, y: 2},
      {x: 2, y: 20},
      {x: 3, y: 10},
      {x: 4, y: 4},
    ];
    return {
      data: sampleData,
      domain: {x: [0, 30], y: [0, 100]}
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
      <div class='row'>
        <h1>hn trends</h1>
        <Chart data={this.state.data} domain={this.state.domain}/>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
