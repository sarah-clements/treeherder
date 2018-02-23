import React from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import Navigation from "./Navigation";
import GenericTable from "./GenericTable";
import { fetchBugData, updateTreeName, updateDateRange, fetchBugsThenBugzilla } from "./../redux/actions";
import BugColumn from "./BugColumn";
import { apiUrlFormatter, calculateMetrics, mergeBugsData, parseUrlParams, updateUrlParams } from "../helpers";
import GraphsContainer from "./GraphsContainer";

class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphOneData: null,
        graphTwoData: null,
        totalFailures: 0,
        totalRuns: 0,
        bugsData: null
    };
    this.updateData = this.updateData.bind(this);
    this.updateStateData = this.updateStateData.bind(this);
}

componentDidMount() {
    const { graphs, bugs, ISOfrom, ISOto, tree, fetchFullBugData } = this.props;
    if (!graphs.results) {
        this.updateData("failurecount", "BUGS_GRAPHS");
    }
    if (!bugs.results) {
        fetchFullBugData(apiUrlFormatter("failures", ISOfrom, ISOto, tree), "BUGS");
    }
}

componentWillReceiveProps(nextProps) {
    const { graphs, history, ISOfrom, ISOto, tree, location, bugs, bugzillaData } = nextProps;

    if (bugzillaData.bugs && bugzillaData.bugs !== this.props.bugzillaData.bugs) {
        this.setState(mergeBugsData(bugs.results, bugzillaData.bugs));
    }

    if (graphs.length > 0 && (graphs !== this.props.graphs || !this.state.graphOneData)) {
        this.setState(calculateMetrics(graphs));
    }
    //update all data if the user edits dates or tree via the query params
    if (location.search !== this.props.location.search) {
        this.updateStateData(location.search);
    }
    //update query params in the address bar if dates or tree are updated via the UI
    if (ISOfrom !== this.props.ISOfrom || ISOto !== this.props.ISOto || tree !== this.props.tree) {
        const queryParams = updateUrlParams(ISOfrom, ISOto, tree);

        if (queryParams !== history.location.search) {
            history.replace(`/main${queryParams}`);
            //we do this so api's won't be called twice (because location.search will update)
            this.props.location.search = queryParams;
        }
    }
}

updateStateData(params) {
    const [from, to, ISOfrom, ISOto, tree] = parseUrlParams(params);
    const { updateTree, updateDates, fetchData, fetchFullBugData } = this.props;
    updateDates(from, to, ISOfrom, ISOto, "BUGS");
    updateTree(tree, "BUGS");
    fetchData(apiUrlFormatter("failurecount", ISOfrom, ISOto, tree), "BUGS_GRAPHS");
    fetchFullBugData(apiUrlFormatter("failures", ISOfrom, ISOto, tree), "BUGS");
}

updateData(api, name) {
    const { fetchData, ISOfrom, ISOto, tree } = this.props;
    fetchData(apiUrlFormatter(api, ISOfrom, ISOto, tree), name);
}

render() {
    const { bugs, tableFailureMessage, graphFailureMessage, from, to, ISOfrom, ISOto, tree } = this.props;
    const { graphOneData, graphTwoData, totalFailures, totalRuns, bugsData } = this.state;
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

            {!tableFailureMessage && bugsData ?
            <GenericTable bugs={bugsData} columns={columns} name="BUGS" tableApi="failures" ISOfrom={ISOfrom}
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
