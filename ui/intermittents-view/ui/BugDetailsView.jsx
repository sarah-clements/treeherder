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
import { calculateMetrics, jobsUrl, createApiUrl, logviewerUrl, parseQueryParams, createQueryParams, prettyDate } from "../helpers";
import { bugDetailsEndpoint, graphsEndpoint, treeherderDomain } from "../constants";

class BugDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateData = this.updateData.bind(this);
}

componentDidMount() {
    const { fetchData, from, to, tree, bugId } = this.props;
    fetchData(createApiUrl(treeherderDomain, graphsEndpoint, { startday: from, endday: to, tree, bug: bugId }), "BUG_DETAILS_GRAPHS");
}

componentWillReceiveProps(nextProps) {
    const { graphs, history, from, to, tree, location, bugId } = nextProps;

    if (graphs.length > 0 && graphs !== this.props.graphs) {
        this.setState(calculateMetrics(graphs));
    }
    if (location.search !== this.props.location.search) {
        this.updateData(location.search);
    }
    //update query params in the address bar if dates or tree are updated via the UI
    if (from !== this.props.from || to !== this.props.to || tree !== this.props.tree) {
        const queryParams = createQueryParams({ startday: from, endday: to, tree, bug: bugId });

        if (queryParams !== history.location.search) {
            history.replace(`/bugdetails${queryParams}`);
            //we do this so api's won't be called twice (because location.search will update)
            this.props.location.search = queryParams;
        }
    }
}

updateData(query) {
    const [from, to, tree, bugId] = parseQueryParams(query);
    const { updateTree, updateDates, fetchData, updateBugDetails, summary, bugCount } = this.props;
    const params = { startday: from, endday: to, tree, bug: bugId };

    updateDates(from, to, "BUG_DETAILS");
    updateTree(tree, "BUG_DETAILS");
    // Todo fetch summary from bugzilla
    updateBugDetails(bugId, summary, bugCount, "BUG_DETAILS");
    fetchData(createApiUrl(treeherderDomain, graphsEndpoint, params), "BUG_DETAILS_GRAPHS");
    fetchData(createApiUrl(treeherderDomain, bugDetailsEndpoint, params), "BUG_DETAILS");
}

render() {
    const { graphs, tableFailureMessage, graphFailureMessage, from, to, bugDetails, tree, bugId, summary, bugCount } = this.props;
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
            minWidth: 200,
        },
        {
            Header: "Log",
            accessor: "job_id",
            Cell: props => <a href={logviewerUrl(props.original.tree, props.value)} target="_blank">view details</a>
        }
    ];
    const params = { startday: from, endday: to, tree, bug: bugId };

    let graphOneData = null;
    let graphTwoData = null;

    if (graphs && graphs.length > 0) {
        ({ graphOneData, graphTwoData } = calculateMetrics(graphs));
    }

    return (
        <Container fluid style={{ marginBottom: "5rem", marginTop: "4.5rem", maxWidth: "1200px" }}>
            <Navigation params={params} tableApi={bugDetailsEndpoint} graphApi={graphsEndpoint} bugId={bugId}
                        name="BUG_DETAILS" graphName="BUG_DETAILS_GRAPHS" tree={tree}
            />
            <Row>
                <Col xs="12"><span className="pull-left"><Link to="/"><Icon name="arrow-left" className="pr-1" />back</Link></span></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><h1>{`Details for Bug ${bugId}`}</h1></Col>
            </Row>
            <Row>
                <Col xs="12" className="mx-auto"><p className="subheader">{`${prettyDate(from)} to ${prettyDate(to)} UTC`}</p></Col>
            </Row>
            {summary &&
            <Row>
                <Col xs="4" className="mx-auto"><p className="text-secondary text-center">{summary}</p></Col>
            </Row>}
            {bugCount &&
            <Row>
                <Col xs="12" className="mx-auto"><p className="text-secondary">{bugCount} total failures</p></Col>
            </Row>}

            {!graphFailureMessage && graphOneData && graphTwoData ?
            <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} name="BUG_DETAILS" tree={tree}
                             graphName="BUG_DETAILS_GRAPHS" tableApi={bugDetailsEndpoint} params={params}
                             graphApi={graphsEndpoint} bugId={bugId} dateOptions
            /> : <p>{tableFailureMessage}</p>}

            {!tableFailureMessage || (bugDetails && !tableFailureMessage) ?
            <GenericTable bugs={bugDetails.results} columns={columns} name="BUG_DETAILS" tableApi={bugDetailsEndpoint}
                          totalPages={bugDetails.total_pages} params={params} bugId={bugId}
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
    tree: state.bugDetailsTree.tree,
    bugId: state.bugDetails.bugId,
    summary: state.bugDetails.summary,
    bugCount: state.bugDetails.bugCount
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name)),
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name)),
    updateBugDetails: (bugId, summary, bugCount, name) => dispatch(updateSelectedBugDetails(bugId, summary, bugCount, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugDetailsView);
