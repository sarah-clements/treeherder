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

export class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

componentDidMount() {
    let url = apiUrlFormatter('bugs', this.props.ISOfrom, this.props.ISOto, 'trunk');
    this.props.fetchData(url, 'BUGS_DATA');
    // console.log(url);
}

render() {
    const { bugs, failureMessage, from, to } = this.props;
    const columns = [
        {
          Header: "Bug ID",
          accessor: "id",
          Cell: props => <BugColumn bugId={props.value}/>
        },
        {
          Header: "Count",
          accessor: "status",
        },
        {
          Header: "Summary",
          accessor: "summary",
        },
        {
          Header: "Whiteboard",
          accessor: "whiteboard",
        }
      ];

    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row>
                    <Col xs="12" className="mx-auto pt-3"><h1>Intermittent Test Failures</h1></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto"><p className="subheader">{`${from} to ${to}`}</p></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto pb-5"><p className="text-secondary">X failures in X pushes</p></Col>
                </Row>
                {/* TODO: Set up manual/server side table sorting/pagination with redux*/}
            <DateRangePicker stateName='BUGS'/>
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
    ISOto: state.dates.ISOto
});

const mapDispatchToProps = dispatch => ({
    fetchData: (url, dataName) => dispatch(fetchBugData(url, dataName))
});

export default connect(mapStateToProps, mapDispatchToProps)(IntermittentsView);
