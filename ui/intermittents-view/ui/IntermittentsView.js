import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import GenericTable from './GenericTable';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import DateRangePicker from './DateRangePicker';
import moment from 'moment';

export class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        from: null,
        to: null,
        ISOto: null,
        ISOfrom: null,
        tree: 'trunk'
    };
    this.getDefaultDates = this.getDefaultDates.bind(this);
  }

componentDidMount() {
    this.getDefaultDates();
    // this.fetchBugData();
}

fetchBugData() {
    let url = `http://localhost:3000/bugs?startday=${this.props.ISOfrom}&endday=${this.props.ISOto}&tree=${this.state.tree}`;
    console.log(url);
    this.props.fetchData(url);
}

getDefaultDates() {
    const today = moment();
    const ISOto = today.format("YYYY-MM-DD");
    const to = today.format("ddd MMM D, YYYY");
    const ISOfrom = today.subtract(7, 'days').format("YYYY-MM-DD");
    const from = moment().subtract(7, 'days').format("ddd MMM D, YYYY");;
    this.setState({ from, to, ISOto, ISOfrom }, () => this.fetchBugData());
}

render() {
    const { bugs, failureMessage } = this.props;
    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row style={{ margin: 'auto' }}>
                    <Col xs="12" className="mx-auto pt-3"><h1>Intermittent Test Failures</h1></Col>
                </Row>
                <Row style={{ margin: 'auto' }}>
                    <Col xs="12" className="mx-auto pb-6"><h2>{`${this.state.from} to ${this.state.to}`}</h2></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto pb-10"><p>X failures in X pushes</p></Col>
                </Row>
                {/* TODO: Set up manual/server side table sorting/pagination with redux*/}
            <DateRangePicker defaultFrom={this.state.from} defaultTo={this.state.to} />
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
    failureMessage: state.failureMessage
});

const mapDispatchToProps = dispatch => ({
    fetchData: url => dispatch(fetchBugData(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(IntermittentsView);
