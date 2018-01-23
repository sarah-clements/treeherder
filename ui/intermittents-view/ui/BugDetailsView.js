import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import { fetchBugData, updateDateRange } from './../redux/actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from 'react-fontawesome';
import GenericTable from './GenericTable';
import GraphsContainer from './GraphsContainer';
import { calculateMetrics, jobsUrl, logviewerUrl } from '../helpers';
import { oranges } from '../constants';

export class BugDetailsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphOneData: null,
        graphTwoData: null,
        totalOranges: 0,
        totalRuns: 0
    };
}

componentDidMount() {
    this.props.updateDates(this.props.location.state.from, this.props.location.state.to, 'BUG_DETAILS');
    this.props.fetchData('http://localhost:3000/byBug', 'BUG_DETAILS');
    this.setState(calculateMetrics(oranges));
}

render() {
    const { bugId, summary } = this.props.location.state;
    const { from, to, bugDetails, failureMessage } = this.props;
    const { graphOneData, graphTwoData } = this.state;

    const columns = [
        {
            Header: "Start Time",
            accessor: "starttime",
        },
        {
            Header: "Tree",
            accessor: "branch",
        },
        {
            Header: "Revision",
            accessor: "revision",
            Cell: props => <a href={jobsUrl(props.original.branch, props.value)} target="_blank">{props.value}</a>
        },
        {
            Header: "Platform",
            accessor: "platform",
        },
        {
            Header: "Build type",
            accessor: "buildtype",
        },
        {
            Header: "Test Suite",
            accessor: "test",
        },
        {
            Header: "Test Machine",
            accessor: "machinename",
        },
        {
            Header: "Log",
            accessor: "buildtype",
            // need to replace 0 with treeherder_id in logviewerUrl call
            Cell: props => <a href={logviewerUrl(props.original.branch, 0)} target="_blank">view details</a>
        }
    ];
    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '4.5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row>
                    <Col xs="12"><span className="pull-left"><Link to="/intermittentsview.html"><Icon name="arrow-left" className="pr-1"/>back</Link></span></Col>
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
                <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} dateOptions={true}/>}

                {bugDetails && failureMessage === '' ?
                <GenericTable bugs={bugDetails} columns={columns} trStyling={false}/> : <p>{failureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugDetails: state.bugDetailsData.data,
    failureMessage: state.bugDetailsData.failureMessage,
    from: state.bugDetailsDates.from,
    to: state.bugDetailsDates.to,
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugDetailsView);
