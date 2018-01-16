import React from 'react';
import MG from 'metrics-graphics';
import 'metrics-graphics/dist/metricsgraphics.css';

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        target: this.props.specs.target
    };
    this.updateTarget = this.updateTarget.bind(this);
  }

shouldComponentUpdate(nextProps, nextState) {
    return nextState.target !== this.state.target;
}

componentDidUpdate() {
    this.props.specs.target = this.state.target;
    this.props.specs.data = this.props.data;
    this.createGraphic();
}

createGraphic() {
    MG.data_graphic(this.props.specs);
};

updateTarget(element) {
    if (this.state.target) {
        this.setState({ target: element });
    }
}

render() {
    return (
        <div className="mx-auto pb-3" ref={ ele => this.updateTarget(ele) }>
            {this.props.specs.legend && <div className="legend"></div>}
        </div>
        );
    }
}
