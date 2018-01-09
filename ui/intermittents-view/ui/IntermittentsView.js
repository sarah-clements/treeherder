import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import GenericTable from './GenericTable';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import DateRangePicker from './DateRangePicker';
import { apiUrlFormatter } from '../constants';

export class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

componentDidMount() {
    let url = `http://localhost:3000/bugs?startday=${this.props.ISOfrom}&endday=${this.props.ISOto}&tree=trunk`;
    console.log(url);
    this.props.fetchData(apiUrlFormatter('bugs', this.props.ISOfrom, this.props.ISOto, 'trunk'));
}

render() {
    const { bugs, failureMessage, from, to } = this.props;
    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row style={{ margin: 'auto' }}>
                    <Col xs="12" className="mx-auto pt-3"><h1>Intermittent Test Failures</h1></Col>
                </Row>
                <Row style={{ margin: 'auto' }}>
                    <Col xs="12" className="mx-auto pb-6"><h2>{`${from} to ${to}`}</h2></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto pb-10"><p>X failures in X pushes</p></Col>
                </Row>
                {/* TODO: Set up manual/server side table sorting/pagination with redux*/}
            <DateRangePicker />
            {bugs && failureMessage === '' ?
                <GenericTable bugs={bugs}/> : <p>{failureMessage}</p>}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};

const mapStateToProps = state => ({
    bugs: state.bugs,
    failureMessage: state.failureMessage,
    from: state.from,
    to: state.to,
    ISOfrom: state.ISOfrom,
    ISOto: state.ISOto
});

const mapDispatchToProps = dispatch => ({
    fetchData: url => dispatch(fetchBugData(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(IntermittentsView);
