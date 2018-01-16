import React from 'react';
import { Row, Button } from 'reactstrap';
import Graph from './Graph';
import { graphOneSpecs, graphTwoSpecs } from '../constants';

export default class GraphsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGraphTwo: false,
        };
        this.toggleGraph = this.toggleGraph.bind(this);
      }

    toggleGraph() {
        this.setState({ showGraphTwo: !this.state.showGraphTwo });
    }

    render() {
    const { graphOneData, graphTwoData } = this.props;
    const { showGraphTwo } = this.state;

        return (
        <React.Fragment>
            <Row className="pt-5">
                <Graph specs={graphOneSpecs} data={graphOneData}/>
            </Row>
            <Row>
                <Button color="secondary" onClick={this.toggleGraph} className="mx-auto">{`show ${showGraphTwo ? "less" : "more"}`}</Button>
            </Row>
            {showGraphTwo &&
            <Row className="pt-5">
                <Graph specs={graphTwoSpecs} data={graphTwoData}/>
            </Row>}
        </React.Fragment>
        );
    }
}
