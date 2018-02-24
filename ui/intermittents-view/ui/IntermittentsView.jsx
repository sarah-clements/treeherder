import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import GenericTable from "./GenericTable";
import { fetchBugData, updateTreeName, updateDateRange, fetchBugsThenBugzilla } from "./../redux/actions";
import BugColumn from "./BugColumn";
import { createApiUrl, calculateMetrics, mergeBugsData, parseQueryParams, createQueryParams } from "../helpers";
import GraphsContainer from "./GraphsContainer";
import { treeherderDomain, bugsEndpoint, graphsEndpoint } from "../constants";

class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateData = this.updateData.bind(this);
    // this.updateTable = this.updateTable.bind(this);
}

componentDidMount() {
    const { graphs, ISOfrom, ISOto, tree, fetchData, bugs, fetchFullBugData } = this.props;
    if (!graphs.results) {
        fetchData(createApiUrl(treeherderDomain, graphsEndpoint, { startday: ISOfrom, endday: ISOto, tree }), "BUGS_GRAPHS");
    }
    if (!bugs.results) {
        fetchFullBugData(createApiUrl(treeherderDomain, bugsEndpoint, { startday: ISOfrom, endday: ISOto, tree }), "BUGS");
    }
}

componentWillReceiveProps(nextProps) {
    const { history, ISOfrom, ISOto, tree, location } = nextProps;

    //update all data if the user edits dates or tree via the query params
    if (location.search !== this.props.location.search) {
        this.updateData(location.search);
    }
    //update query params in the address bar if dates or tree are updated via the UI
    if (ISOfrom !== this.props.ISOfrom || ISOto !== this.props.ISOto || tree !== this.props.tree) {
        const queryParams = createQueryParams({ startday: ISOfrom, endday: ISOto, tree });

        if (queryParams !== history.location.search) {
            history.replace(`/main${queryParams}`);
            //we do this so api's won't be called twice (because location.search will trigger this lifecycle hook)
            this.props.location.search = queryParams;
        }
    }
}

updateData(params) {
    const [from, to, ISOfrom, ISOto, tree] = parseQueryParams(params);
    const { updateTree, updateDates, fetchData, fetchFullBugData } = this.props;
    updateDates(from, to, ISOfrom, ISOto, "BUGS");
    updateTree(tree, "BUGS");
    fetchData(createApiUrl(treeherderDomain, graphsEndpoint, { startday: ISOfrom, endday: ISOto, tree }), "BUGS_GRAPHS");
    fetchFullBugData(createApiUrl(treeherderDomain, bugsEndpoint, { startday: ISOfrom, endday: ISOto, tree }), "BUGS");
}

render() {
    const { bugs, tableFailureMessage, graphFailureMessage, from, to, ISOfrom, ISOto, tree, bugzillaData, graphs } = this.props;
    const columns = [
        {
          Header: "Bug ID",
          accessor: "id",
          Cell: props => <BugColumn data={props.original} />
        },
        {
          Header: "Count",
          accessor: "count",
        },
        {
          Header: "Summary",
          accessor: "summary",
          minWidth: 250,
        },
        {
          Header: "Whiteboard",
          accessor: "whiteboard",
          minWidth: 150
        }
      ];

    let bugsData = [];
    let graphOneData = null;
    let graphTwoData = null;
    let totalFailures = 0;
    let totalRuns = 0;

    if (bugs.results && bugzillaData.bugs && bugzillaData.bugs.length > 0) {
       bugsData = mergeBugsData(bugs.results, bugzillaData.bugs);
    }

    if (graphs && graphs.length > 0) {
        ({ graphOneData, graphTwoData, totalFailures, totalRuns } = calculateMetrics(graphs));
    }

    const params = { startday: ISOfrom, endday: ISOto, tree };

    return (
        <Container fluid style={{ marginBottom: "5rem", marginTop: "5rem", maxWidth: "1200px" }}>
            <Navigation name="BUGS" graphName="BUGS_GRAPHS" tableApi={bugsEndpoint} params={params}
                        graphApi={graphsEndpoint} tree={tree}
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
            <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} name="BUGS" params={params}
                             graphName="BUGS_GRAPHS" tableApi={bugsEndpoint} graphApi={graphsEndpoint} tree={tree}
            />: <p>{tableFailureMessage}</p>}

            {!tableFailureMessage ?
            <GenericTable bugs={bugsData} columns={columns} name="BUGS" tableApi={bugsEndpoint} params={params}
                          totalPages={bugs.total_pages} trStyling updateTable={this.updateTable}
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
    tree: state.mainTree.tree,
    bugzillaData: state.bugzilla.data,
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    fetchFullBugData: (url, name) => dispatch(fetchBugsThenBugzilla(url, name)),
    updateDates: (from, to, ISOfrom, ISOto, name) => dispatch(updateDateRange(from, to, ISOfrom, ISOto, name)),
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(IntermittentsView);
