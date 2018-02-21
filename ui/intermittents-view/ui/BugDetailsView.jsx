import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "react-fontawesome";
import Navigation from "./Navigation";
import { fetchBugData, updateDateRange, updateTreeName, updateSelectedBugDetails } from "./../redux/actions";
import GenericTable from "./GenericTable";
import GraphsContainer from "./GraphsContainer";
import { calculateMetrics, jobsUrl, apiUrlFormatter, logviewerUrl, parseUrlParams, updateUrlParams } from "../helpers";

class BugDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphOneData: null,
        graphTwoData: null,
        totalFailures: 0,
        totalRuns: 0,
        bugId: null,
        summary: null
    };
    this.updateData = this.updateData.bind(this);
    this.updateStateData = this.updateStateData.bind(this);
}

componentDidMount() {
    this.updateData("failurecount", "BUG_DETAILS_GRAPHS");
}

componentWillReceiveProps(nextProps) {
    const { graphs, history, ISOfrom, ISOto, tree, location, bugId } = nextProps;

    if (graphs.length > 0 && graphs !== this.props.graphs) {
        this.setState(calculateMetrics(graphs));
    }
    if (location.search !== this.props.location.search) {
        this.updateStateData(location.search);
    }
    //update query params in the address bar if dates or tree are updated via the UI
    if (ISOfrom !== this.props.ISOfrom || ISOto !== this.props.ISOto || tree !== this.props.tree) {
        const queryParams = updateUrlParams(ISOfrom, ISOto, tree, bugId);

        if (queryParams !== history.location.search) {
            history.replace(`/bugdetails${queryParams}`);
            //we do this so api's won't be called twice (because location.search will update)
            this.props.location.search = queryParams;
        }
    }
}

updateStateData(params) {
    const [from, to, ISOfrom, ISOto, tree, bugId] = parseUrlParams(params);
    const { updateTree, updateDates, fetchData, updateBugDetails } = this.props;
    updateDates(from, to, ISOfrom, ISOto, "BUG_DETAILS");
    updateTree(tree, "BUG_DETAILS");
    // Todo fetch summary from bugzilla
    updateBugDetails(bugId, "", "BUG_DETAILS");
    fetchData(apiUrlFormatter("failurecount", ISOfrom, ISOto, tree, bugId), "BUG_DETAILS_GRAPHS");
    fetchData(apiUrlFormatter("failuresbybug", ISOfrom, ISOto, tree, bugId), "BUG_DETAILS");
}

updateData(api, name) {
    const { fetchData, ISOfrom, ISOto, tree, bugId } = this.props;
    fetchData(apiUrlFormatter(api, ISOfrom, ISOto, tree, bugId), name);
}

render() {
    const { tableFailureMessage, graphFailureMessage, from, to, ISOfrom, ISOto, bugDetails, tree, bugId, summary } = this.props;
    const { graphOneData, graphTwoData } = this.state;
    const totalCount = bugDetails.results ? bugDetails.results.length : 0;
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
                        name="BUG_DETAILS" graphName="BUG_DETAILS_GRAPHS" tree={tree} bugId={bugId}
            />
            <Row>
                <Col xs="12"><span className="pull-left"><Link to="/"><Icon name="arrow-left" className="pr-1" />back</Link></span></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><h1>{`Details for Bug ${bugId}`}</h1></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="subheader">{`${from} to ${to} UTC`}</p></Col>
            </Row>
            <Row>
                <Col xs="4" className="mx-auto"><p className="text-secondary text-center">{summary}</p></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="text-secondary">{totalCount} total failures</p></Col>
            </Row>

            {!graphFailureMessage && graphOneData && graphTwoData ?
            <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} name="BUG_DETAILS" tree={tree}
                             graphName="BUG_DETAILS_GRAPHS" ISOfrom={ISOfrom} ISOto={ISOto} tableApi="failuresbybug"
                             graphApi="failurecount" bugId={bugId} dateOptions
            /> : <p>{tableFailureMessage}</p>}

            {!tableFailureMessage || (bugDetails && !tableFailureMessage) ?
            <GenericTable bugs={bugDetails.results} columns={columns} name="BUG_DETAILS" tableApi="failuresbybug" ISOfrom={ISOfrom}
                          ISOto={ISOto} tree={tree} totalPages={bugDetails.total_pages} bugId={bugId}
            /> : <p>{tableFailureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugDetails: state.bugDetailsData.data,
    graphs: state.bugDetailsGraphData.data,
    tableFailureMessage: state.bugDetailsData.message,
    graphsFailureMessage: state.bugDetailsGraphData.message,
    from: state.bugDetailsDates.from,
    to: state.bugDetailsDates.to,
    ISOfrom: state.bugDetailsDates.ISOfrom,
    ISOto: state.bugDetailsDates.ISOto,
    tree: state.bugDetailsTree.tree,
    bugId: state.bugDetails.bugId,
    summary: state.bugDetails.summary
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, ISOfrom, ISOto, name) => dispatch(updateDateRange(from, to, ISOfrom, ISOto, name)),
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name)),
    updateBugDetails: (bugId, summary, name) => dispatch(updateSelectedBugDetails(bugId, summary, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugDetailsView);
