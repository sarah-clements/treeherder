import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import GenericTable from './GenericTable';
import TableControls from './TableControls';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';

export class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        from: null,
        to: new Date(),
    };
  }

componentDidMount() {
    // let url = `/bugs?${this.state.from}&${this.state.to}`;
    this.props.fetchData('http://localhost:3000/bugs/');
}

render() {
    const { bugs, failureMessage } = this.props;
    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row style={{ margin: 'auto' }}>
                    <Col xs="12" className="mx-auto pt-3"><h1>Intermittent Failures</h1></Col>
                </Row>
                <Row style={{ margin: 'auto' }}>
                    <Col xs="12" className="mx-auto pb-6"><h2>From date1 to date2 UTC</h2></Col>
                </Row>
            <TableControls />
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
