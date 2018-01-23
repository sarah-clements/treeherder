import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import GenericTable from './GenericTable';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import BugColumn from './BugColumn';
import { apiUrlFormatter, calculateMetrics } from '../helpers';
import GraphsContainer from './GraphsContainer';
import { oranges } from '../constants';

export class IntermittentsView extends React.Component {
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
    let url = apiUrlFormatter('bugs', this.props.ISOfrom, this.props.ISOto, this.props.tree);
    this.props.fetchData(url, 'BUGS');
    this.setState(calculateMetrics(oranges));
}

render() {
    const { bugs, failureMessage, from, to, ISOfrom, ISOto } = this.props;
    const { graphOneData, graphTwoData, totalOranges, totalRuns } = this.state;
    const columns = [
        {
          Header: 'Bug ID',
          accessor: 'id',
          Cell: props => <BugColumn data={props.original}/>
        },
        {
          Header: 'Count',
          accessor: 'status',
        },
        {
          Header: 'Summary',
          accessor: 'summary',
          minWidth: 250,
          filterable: true,
          Filter: () => <input style={{ width: "100%", borderColor: "rgb(206, 212, 218)" }} placeholder="Search..."/>
        },
        {
          Header: 'Whiteboard',
          accessor: 'whiteboard',
          minWidth: 150
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
                <Col xs='12' className='mx-auto'><p className='text-secondary'>{totalOranges} failures in {totalRuns} pushes</p></Col>
            </Row>

            {graphOneData && graphTwoData &&
            <GraphsContainer graphOneData={graphOneData} graphTwoData={graphTwoData} />}

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
