import React from 'react';
import MG from 'metrics-graphics';
import 'metrics-graphics/dist/metricsgraphics.css';
// import * as d3 from 'd3';
// import { connect } from 'react-redux';
// import { fetchBugData } from './../redux/actions';
// import PropTypes from 'prop-types';
// import { apiUrlFormatter } from '../constants';


const data = [
    {
        date: "2014-01-01",
        value: 190000000
    },
    {
        date: "2014-01-02",
        value: 190379978
    },
    {
        date: "2014-01-03",
        value: 90493749
    },
    {
        date: "2014-01-04",
        value: 190785250
    },
    {
        date: "2014-01-05",
        value: 190000000
    },
    {
        date: "2014-01-06",
        value: 90493749
    }
];

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        target: "graphic"
    };
    this.updateTarget = this.updateTarget.bind(this);
  }

componentDidMount() {
    // let url = apiUrlFormatter('count', this.props.ISOfrom, this.props.ISOto, this.props.tree);
    // this.props.fetchData(url, 'BUGS');
}

shouldComponentUpdate(nextProps, nextState) {
    return nextState.target !== this.state.target;
}

componentDidUpdate() {
    // let url = apiUrlFormatter('count', this.props.ISOfrom, this.props.ISOto, this.props.tree);
    // this.props.fetchData(url, 'BUGS');
    this.createGraphic(data);
}

createGraphic(data) {
    data = MG.convert.date(data, "date");
    MG.data_graphic({
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
    // console.log(moment("1970-01-01").format("x")); <-- unix timestamp conversion

    return (
        <div className="mx-auto pb-4" ref={ ele => this.updateTarget(ele) }></div>
        );
    }
}
