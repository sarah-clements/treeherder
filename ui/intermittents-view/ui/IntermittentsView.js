import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import GenericTable from './GenericTable';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import DateRangePicker from './DateRangePicker';
import BugColumn from './BugColumn';
import { apiUrlFormatter } from '../constants';
import Graph from './Graph';

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
        dateCounts: null,
        dateTestRunCounts: null,
        dateFreqs: null
    };
  }

componentDidMount() {
    let url = apiUrlFormatter('bugs', this.props.ISOfrom, this.props.ISOto, this.props.tree);
    this.props.fetchData(url, 'BUGS');
    this.parseGraphData(oranges);
}

parseGraphData(data) {
    let dateCounts = [];
    let dateTestRunCounts = [];
    let dateFreqs = [];
    Object.entries(data).map((entry) => {
        let freqs = entry[1].testruns < 1 ? 0 : (entry[1].orangecount/entry[1].testruns);
        [dateCounts, dateTestRunCounts, dateFreqs] = this.calculateMetric(entry[0], entry[1].orangecount,
            entry[1].testruns, freqs, dateCounts, dateTestRunCounts, dateFreqs);
    });
    this.setState({ dateCounts, dateTestRunCounts, dateFreqs });
}

calculateMetric(date, count, testruns, freq, dateCounts, dateTestRunCounts, dateFreqs) {
    dateCounts.push({ date, value: count });
    dateTestRunCounts.push({ date, value: testruns });
    dateFreqs.push({ date, value: freq.toFixed(2) });
    return [dateCounts, dateTestRunCounts, dateFreqs];
}

render() {
    const { bugs, failureMessage, from, to, ISOfrom, ISOto } = this.props;
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
    console.log(this.state.dateCounts, this.state.dateTestRunCounts);
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
                <Col xs='12' className='mx-auto pb-5'><p className='text-secondary'>X failures in X pushes</p></Col>
            </Row>
            <Row>
                {this.state.dateFreqs &&
                <Graph data={this.state.dateFreqs} />}
            </Row>
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
