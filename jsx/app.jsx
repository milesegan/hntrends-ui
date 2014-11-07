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
    var data = this.props.topics[0].data;
    var minX = d3.min(data, d => d[0]);
    var maxX = d3.max(data, d => d[0]);
    var maxY = d3.max(data, d => d[1]);
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
      .attr('transform', `translate(0, ${box.height - margin})`)
      .call(xAxis);
    c.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin},0)`)
      .call(yAxis);
    this.props.topics.forEach((t,i) => {
      var line = i % 7;
      var lineFunc = d3.svg.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .interpolate('linear');
      c.append('path')
        .attr('class', `trendline line-${line}`)
        .attr('d', lineFunc(t.data));
    });
  }
});

var HNTrendUI = React.createClass({
  addTopic(data) {
    var newTopics = this.state.topics;
    newTopics.push(data);
    this.setState({topics: newTopics});
  },
  getInitialState() {
    return {
      topics: []
    }
  },
  componentDidMount() {
    var topics = ["apple", "google", "microsoft"];
    topics.forEach(t => {
      $.get(`http://hn.globalonset.com/api/v0/topic/${t}`,
        null,
        (data) => {
          this.addTopic(data)
        });
    });
  },
  render() {
    var topicNames = this.state.topics.map(i => i.topic).join(", ");
    return (
      <div>
        <div className='row'>
          <h1 className="col-md-12">{topicNames}</h1>
        </div>
        <div className='row'>
          <Chart topics={this.state.topics}/>
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
