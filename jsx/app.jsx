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
    return (<div className="chart"></div>);
  },
  shouldComponentUpdate() {
    this.updateChart();
    return false;
  },
  updateChart() {
    d3.select(this.getDOMNode())
      .svg
      .line()
      .x((d) => { return d; })
      .y((d) => { return d; });
  }
});

var HNTrendUI = React.createClass({
  getInitialState() {
    var sampleData = [
      {id: '5fbmzmtc', x: 7, y: 41, z: 6},
      {id: 's4f8phwm', x: 11, y: 45, z: 9},
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
