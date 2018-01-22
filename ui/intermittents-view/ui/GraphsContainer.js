import React from 'react';
import { Row, Button, Col } from 'reactstrap';
import Graph from './Graph';
import { graphOneSpecs, graphTwoSpecs } from '../constants';
import DateOptions from './DateOptions';

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
    const { graphOneData, graphTwoData, dateOptions } = this.props;
    const { showGraphTwo } = this.state;

        return (
        <React.Fragment>
            <Row className="pt-5">
                <Graph specs={graphOneSpecs} data={graphOneData}/>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto">
                    <Button color="secondary" onClick={this.toggleGraph} className="d-inline-block mr-3">{`show ${showGraphTwo ? "less" : "more"}`}</Button>
                    {dateOptions &&
                    <DateOptions />}
                </Col>
            </Row>
            {showGraphTwo &&
            <Row className="pt-5">
                <Graph specs={graphTwoSpecs} data={graphTwoData}/>
            </Row>}
        </React.Fragment>
        );
    }
}
