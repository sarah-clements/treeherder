import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import GenericTable from "./GenericTable";
import { fetchBugData } from "./../redux/actions";
import BugColumn from "./BugColumn";
import { apiUrlFormatter, calculateMetrics } from "../helpers";
import GraphsContainer from "./GraphsContainer";
// const _ = require('lodash');

class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphOneData: null,
        graphTwoData: null,
        totalFailures: 0,
        totalRuns: 0,
        textInput: ''
    };
    this.updateData = this.updateData.bind(this);
}

componentDidMount() {
    const { bugs } = this.props;
    if (!bugs.results) {
        this.updateData("failurecount", "BUGS_GRAPHS");
    }
}

// const { location, fetchData } = this.props;
// let ISOfrom, ISOto, tree;

// if (_.isEmpty(location.search)) {
//     ({ ISOfrom, ISOto, tree } = this.props);
// } else {
//     //TODO: error handling if date range is longer than 4 months
//     [ISOfrom, ISOto, tree] = urlParams(location.search);
//     this.props.updateDates(ISOfrom, ISOto, "BUGS");
// }

componentWillReceiveProps(nextProps) {
    console.log(nextProps.location);
    if (nextProps.graphs.length > 0) {
        this.setState(calculateMetrics(nextProps.graphs));
    }
}

updateData(api, name) {
    const { fetchData, ISOfrom, ISOto, tree } = this.props;
    let url = apiUrlFormatter(api, ISOfrom, ISOto, tree);
    fetchData(url, name);
}

render() {
    const { bugs, tableFailureMessage, graphFailureMessage, from, to, ISOfrom, ISOto, tree } = this.props;
    const { graphOneData, graphTwoData, totalFailures, totalRuns } = this.state;
    const columns = [
        {
          Header: "Bug ID",
          accessor: "id",
          Cell: props => <BugColumn data={props.original} />
        },
        {
          Header: "Count",
          accessor: "status",
        },
        {
          Header: "Summary",
          accessor: "summary",
          minWidth: 250,
          filterable: true,
          // Filter: () => (<input style={{ width: "100%", borderColor: "rgb(206, 212, 218)" }}
          //                      onChange={event => this.changeInput(event)} placeholder="Search summary..."
          // />)
        },
        {
          Header: "Whiteboard",
          accessor: "whiteboard",
          minWidth: 150
        }
      ];
    return (
        <Container fluid style={{ marginBottom: ".5rem", marginTop: "5rem", maxWidth: "1200px" }}>
            <Navigation name="BUGS" graphName="BUGS_GRAPHS" ISOfrom={ISOfrom} ISOto={ISOto} tableApi="failures"
                        graphApi="failurecount" tree={tree}
            />
            <Row>
                <Col xs="12" className="mx-auto pt-3"><h1>Intermittent Test Failures</h1></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="subheader">{`${from} to ${to} UTC`}</p></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="text-secondary">{totalFailures} bugs in {totalRuns} pushes</p></Col>
            </Row>

            {!graphFailureMessage && graphOneData && graphTwoData ?
            <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} name="BUGS" tree={tree}
                             graphName="BUGS_GRAPHS" ISOfrom={ISOfrom} ISOto={ISOto} tableApi="failures"
                             graphApi="failurecount"
            />: <p>{tableFailureMessage}</p>}

            {!tableFailureMessage && bugs ?
            <GenericTable bugs={bugs.results} columns={columns} name="BUGS" tableApi="failures" ISOfrom={ISOfrom}
                          ISOto={ISOto} tree={tree} totalPages={bugs.total_pages}trStyling
            /> : <p>{tableFailureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugs: state.bugsData.data,
    graphs: state.bugsGraphData.data,
    tableFailureMessage: state.bugsData.message,
    graphsFailureMessage: state.bugsGraphData.message,
    from: state.dates.from,
    to: state.dates.to,
    ISOfrom: state.dates.ISOfrom,
    ISOto: state.dates.ISOto,
    tree: state.mainTree.tree
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(IntermittentsView);
