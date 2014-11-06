/** @jsx React.DOM */

var d3Chart = {};

d3Chart.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width)
    .attr('height', props.height);

  svg.append('g')
    .attr('class', 'd3-points');

  this.update(el, state);
};

d3Chart.update = function(el, state) {
  // Re-compute the scales, and render the data points
  var scales = this._scales(el, state.domain);
  this._drawPoints(el, scales, state.data);
};

d3Chart.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

d3Chart._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;

  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  var z = d3.scale.linear()
    .range([5, 20])
    .domain([1, 10]);

  return {x: x, y: y, z: z};
};

d3Chart._drawPoints = function(el, scales, data) {
  var g = d3.select(el).selectAll('.d3-points');

  var point = g.selectAll('.d3-point')
    .data(data, function(d) { return d.id; });

  // ENTER
  point.enter().append('circle')
    .attr('class', 'd3-point');

  // ENTER & UPDATE
  point.attr('cx', function(d) { return scales.x(d.x); })
    .attr('cy', function(d) { return scales.y(d.y); })
    .attr('r', function(d) { return scales.z(d.z); });

  // EXIT
  point.exit()
    .remove();
};

var Chart = React.createClass({
  componentDidMount() {
    var el = this.getDOMNode();
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  },
  componentDidUpdate() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },
  componentWillUnmount() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },
  getChartState() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },
  render() {
    return (<div className="chart"></div>);
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
      <div>
        <h1>Hello World!</h1>
        <Chart data={this.state.data} domain={this.state.domain}/>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
