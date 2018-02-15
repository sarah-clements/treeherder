import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "react-fontawesome";
import Navigation from "./Navigation";
import { fetchBugData, updateDateRange, updateTreeName } from "./../redux/actions";
import GenericTable from "./GenericTable";
import GraphsContainer from "./GraphsContainer";
import { calculateMetrics, jobsUrl, apiUrlFormatter, logviewerUrl } from "../helpers";

class BugDetailsView extends React.Component {
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
    const { from, to, tree } = this.props.location.state;
    const { updateDates, updateTree } = this.props;
    updateTree(tree, "BUG_DETAILS");
    updateDates(from, to, "BUG_DETAILS");
    this.updateData("failuresbybug", "BUG_DETAILS");
    this.updateData("failurecount", "BUGS_DETAILS_GRAPHS");
}

componentWillReceiveProps(nextProps) {
    if (nextProps.graphs.length > 0) {
        this.setState(calculateMetrics(nextProps.graphs));
    }
}

updateData(api, name) {
    const { fetchData, ISOfrom, ISOto, tree } = this.props;
    const { bugId } = this.props.location.state;
    let url = apiUrlFormatter(api, ISOfrom, ISOto, tree, bugId);
    fetchData(url, name);
}

render() {
    const { bugId, summary } = this.props.location.state;
    const { from, to, ISOfrom, ISOto, bugDetails, tableFailureMessage, tree } = this.props;
    const { graphOneData, graphTwoData } = this.state;
    const columns = [
        {
            Header: "Push Time",
            accessor: "push_time"
        },
        {
            Header: "Tree",
            accessor: "tree",
        },
        {
            Header: "Revision",
            accessor: "revision",
            Cell: props => <a href={jobsUrl(props.original.tree, props.value)} target="_blank">{props.value}</a>
        },
        {
            Header: "Platform",
            accessor: "platform",
        },
        {
            Header: "Build type",
            accessor: "build_type",
        },
        {
            Header: "Test Suite",
            accessor: "test_suite",
        },
        {
            Header: "Log",
            accessor: "job_id",
            Cell: props => <a href={logviewerUrl(props.original.tree, props.value)} target="_blank">view details</a>
        }
    ];
    return (
        <Container fluid style={{ marginBottom: ".5rem", marginTop: "4.5rem", maxWidth: "1200px" }}>
            <Navigation ISOfrom={ISOfrom} ISOto={ISOto} tableApi="failuresbybug" graphApi="failurecount"
                        tableName="BUG_DETAILS" graphName="BUGS_DETAILS_GRAPHS" tree={tree} bugId={bugId} dateOptions
            />
                <Row>
                    <Col xs="12"><span className="pull-left"><Link to="/intermittentsview.html"><Icon name="arrow-left" className="pr-1" />back</Link></span></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto"><h1>{`Details for Bug ${bugId}`}</h1></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto"><p className="subheader">{`${from} to ${to}`}</p></Col>
                </Row>
                <Row>
                    <Col xs="4" className="mx-auto"><p className="text-secondary text-center">{summary}</p></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto"><p className="text-secondary">X total failures</p></Col>
                </Row>

                {graphOneData && graphTwoData &&
                <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} api="failuresbybug" dateOptions name="BUG_DETAILS" tree={tree} bugId={bugId} />}

                {bugDetails && tableFailureMessage === "" ?
                <GenericTable bugs={bugDetails} columns={columns} trStyling /> : <p>{tableFailureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugDetails: state.bugDetailsData.data.results,
    graphs: state.bugDetailsGraphData.data,
    tableFailureMessage: state.bugDetailsData.failureMessage,
    graphsFailureMessage: state.bugDetailsGraphData.failureMessage,
    from: state.bugDetailsDates.from,
    to: state.bugDetailsDates.to,
    ISOfrom: state.bugDetailsDates.ISOfrom,
    ISOto: state.bugDetailsDates.ISOto,
    tree: state.bugDetailsTree.tree
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name)),
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugDetailsView);
