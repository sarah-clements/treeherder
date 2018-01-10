import React from 'react';
// import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
// import GenericTable from './GenericTable';
// import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from 'react-fontawesome';
// import { apiUrlFormatter } from '../constants';

export default class IntermittentsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

componentDidMount() {
    // let url = apiUrlFormatter('bugs', this.props.ISOfrom, this.props.ISOto, 'trunk');
    // console.log("bugdetailview " + url);
    // this.props.fetchData(url);
}

render() {
    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row>
                    <Col xs="12"><span className="pull-left"><Icon name="arrow-left" className="pr-1"/><Link to="/intermittentsview.html">back</Link></span></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto pt-3"><h1>Bug Details</h1></Col>
                </Row>
            {/* {bugs && failureMessage === '' ?
                <GenericTable bugs={bugs}/> : <p>{failureMessage}</p>} */}
        </Container>);
    }
}

Container.propTypes = {
    fluid: PropTypes.bool
};
