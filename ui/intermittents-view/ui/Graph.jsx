import React from "react";
import MG from "metrics-graphics";
import "metrics-graphics/dist/metricsgraphics.css";

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
