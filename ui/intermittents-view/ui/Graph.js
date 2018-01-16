import React from 'react';
import MG from 'metrics-graphics';
import 'metrics-graphics/dist/metricsgraphics.css';
// import * as d3 from 'd3';

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        target: "graphic"
    };
    this.updateTarget = this.updateTarget.bind(this);
  }

shouldComponentUpdate(nextProps, nextState) {
    return nextState.target !== this.state.target;
}

componentDidUpdate() {
    this.createGraphic(this.props.data);
}

createGraphic(data) {
    data = MG.convert.date(data, "date");
    MG.data_graphic({
        title: "Orange Count Per Push",
        data: data,
        width: 700,
        height: 300,
        right: 40,
        color: "#dd6602",
        target: this.state.target,
        x_accessor: "date",
        y_accessor: "value"
    });
};

updateTarget(element) {
    if (this.state.target) {
        this.setState({ target: element });
    }
}

render() {
    return (
        <div className="mx-auto pb-4" ref={ ele => this.updateTarget(ele) }></div>
        );
    }
}
