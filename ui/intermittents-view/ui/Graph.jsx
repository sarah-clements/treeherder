import React from "react";
import MG from "metrics-graphics";
import "metrics-graphics/dist/metricsgraphics.css";

// Pass a specs object and data array as props;
// specs.target will be updated with a ref callback and
// specs.data will be updated with the fetched data prop
// const yourSpecs = {
//     title: "your title",
//     data: [],
//     target: "",
//     width: 700,
//     height: 300,
//     x_accessor: "date",
//     y_accessor: "value"
// };

export default class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.updateSpecs = this.updateSpecs.bind(this);
  }

componentWillReceiveProps(nextProps) {
    const { specs } = this.props;
    if (specs.data !== nextProps.data) {
        specs.data = nextProps.data;
        this.createGraphic();
    }
}

createGraphic() {
    MG.data_graphic(this.props.specs);
}

updateSpecs(element) {
    if (element) {
        const { specs, data } = this.props;
        specs.target = element;
        specs.data = data;
        this.createGraphic();
    }
}

render() {
    return (
        <div className="mx-auto pb-3" ref={ele => this.updateSpecs(ele)}>
            {this.props.specs.legend && <div className="legend" />}
        </div>
        );
    }
}