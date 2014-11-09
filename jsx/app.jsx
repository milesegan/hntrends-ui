/** @jsx React.DOM */

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
  handleSubmit(event) {
    event.preventDefault();
    var newTopics = this.state.topics;
    newTopics.length = 0;
    this.setState({ topics: newTopics });
    var query = this.refs.query.getDOMNode().value.trim();
    var topics = query.split(" ");
    topics.forEach(t => {
      $.ajax({
        url: `http://hntrend-api.globalonset.com/api/v0/topic/${t}?callback=callback`,
        jsonp: 'callback',
        dataType: 'jsonp',
        success: (data) => {
          this.addTopic(data)
        }
      });
    })
  },
  render() {
    return (
      <div>
        <div className='row'>
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Search Terms" className="form-control" ref="query" />
            <input type="submit" className="btn btn-primary"/>
          </form>
        </div>
        <div className='row'>
          <Chart topics={this.state.topics}/>
        </div>
        <div className='row'>
          <ChartLegend topics={this.state.topics}/>
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <HNTrendUI />,
  document.getElementById('container')
);
