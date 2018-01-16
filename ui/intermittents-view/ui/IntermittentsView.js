import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'reactstrap';
import Navigation from './Navigation';
import GenericTable from './GenericTable';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import DateRangePicker from './DateRangePicker';
import BugColumn from './BugColumn';
import { apiUrlFormatter, calculateMetrics } from '../helpers';
import { graphOneSpecs, graphTwoSpecs } from '../constants';
import Graph from './Graph';

// graph test data
const oranges = {
    "2017-12-28": {
       orangecount: 157,
       testruns: 5,
    },
    "2017-12-27": {
       orangecount: 142,
       testruns: 5,
    },
    "2017-12-26": {
       orangecount: 89,
       testruns: 4,
    },
    "2017-12-25": {
       orangecount: 58,
       testruns: 2,
    },
    "2017-12-24": {
       orangecount: 193,
       testruns: 6,
    },
    "2017-12-23": {
       orangecount: 191,
       testruns: 7,
    },
    "2017-12-22": {
       orangecount: 132,
       testruns: 5,
    },
    "2017-12-21": {
       orangecount: 222,
       testruns: 6,
    }
 };

export class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        graphOneData: null,
        graphTwoData: null,
        showGraphTwo: false,
        totalOranges: 0,
        totalRuns: 0
    };
    this.toggleGraph = this.toggleGraph.bind(this);
  }

componentDidMount() {
    let url = apiUrlFormatter('bugs', this.props.ISOfrom, this.props.ISOto, this.props.tree);
    this.props.fetchData(url, 'BUGS');
    this.setState(calculateMetrics(oranges));
}

toggleGraph() {
    this.setState({ showGraphTwo: !this.state.showGraphTwo });
}

render() {
    const { bugs, failureMessage, from, to, ISOfrom, ISOto } = this.props;
    const { graphOneData, graphTwoData, showGraphTwo, totalOranges, totalRuns } = this.state;
    const columns = [
        {
          Header: 'Bug ID',
          accessor: 'id',
          Cell: props => <BugColumn bugId={props.value}/>
        },
        {
          Header: 'Count',
          accessor: 'status',
        },
        {
          Header: 'Summary',
          accessor: 'summary',
        },
        {
          Header: 'Whiteboard',
          accessor: 'whiteboard',
        }
      ];

    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation name='BUGS' ISOfrom={ISOfrom} ISOto={ISOto} endpoint='bugs'/>
            <Row>
                <Col xs='12' className='mx-auto pt-3'><h1>Intermittent Test Failures</h1></Col>
            </Row>
            <Row>
                <Col xs='12' className='mx-auto'><p className='subheader'>{`${from} to ${to}`}</p></Col>
            </Row>
            <Row>
                <Col xs='12' className='mx-auto pb-5'><p className='text-secondary'>{totalOranges} failures in {totalRuns} pushes</p></Col>
            </Row>
            {graphOneData &&
            <Row>
                <Graph specs={graphOneSpecs} data={graphOneData}/>
            </Row>}
            <Row>
                <Button color="secondary" onClick={this.toggleGraph} className="mx-auto">{`show ${showGraphTwo ? "less" : "more"}`}</Button>
            </Row>
            {showGraphTwo &&
            <Row className="pt-5">
                <Graph specs={graphTwoSpecs} data={graphTwoData}/>
            </Row>}
            {/* TODO: Set up manual/server side table sorting/pagination with redux*/}
            <DateRangePicker name='BUGS'/>
            {bugs && failureMessage === '' ?
                <GenericTable bugs={bugs} columns={columns} trStyling={true}/> : <p>{failureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugs: state.bugsData.data,
    failureMessage: state.bugsData.failureMessage,
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
