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

class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphOneData: null,
        graphTwoData: null,
        totalFailures: 0,
        totalRuns: 0
    };
    this.updateData = this.updateData.bind(this);
}

componentDidMount() {
    this.updateData("failures", "BUGS");
    this.updateData("failurecount", "BUGS_GRAPHS");
}

componentWillReceiveProps(nextProps) {
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
    const { bugs, tableFailureMessage, from, to, ISOfrom, ISOto, tree } = this.props;
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
          Filter: () => <input style={{ width: "100%", borderColor: "rgb(206, 212, 218)" }} placeholder="Search summary..." />
        },
        {
          Header: "Whiteboard",
          accessor: "modified",
          minWidth: 150
        }
      ];
    return (
        <Container fluid style={{ marginBottom: ".5rem", marginTop: "5rem", maxWidth: "1200px" }}>
            <Navigation tableName="BUGS" graphName="BUGS_GRAPHS" ISOfrom={ISOfrom} ISOto={ISOto} tableApi="failures"
                        graphApi="failurecount" tree={tree}
            />
            <Row>
                <Col xs="12" className="mx-auto pt-3"><h1>Intermittent Test Failures</h1></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="subheader">{`${from} to ${to}`}</p></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="text-secondary">{totalFailures} bugs in {totalRuns} pushes</p></Col>
            </Row>

            {graphOneData && graphTwoData &&
            <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} tableName="BUGS" tree={tree}
                             graphName="BUGS_GRAPHS" ISOfrom={ISOfrom} ISOto={ISOto} tableApi="failures"
                             graphApi="failurecount"
            />}

            {bugs && tableFailureMessage === "" ?
                <GenericTable bugs={bugs} columns={columns} trStyling /> : <p>{tableFailureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugs: state.bugsData.data.results,
    graphs: state.bugsGraphData.data,
    tableFailureMessage: state.bugsData.failureMessage,
    graphsFailureMessage: state.bugsGraphData.failureMessage,
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
