import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import Navigation from './Navigation';
import { fetchBugData } from './../redux/actions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from 'react-fontawesome';
import GenericTable from './GenericTable';
// import { apiUrlFormatter } from '../constants';

export class BugDetailsView extends React.Component {
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
    const { from, to } = this.props;
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
            Cell: <a href="" target="_blank">props.value</a>
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
            Cell: <a href="" target="_blank">props.value</a>
        }
      ];
    console.log(this.props.location.state.bugId);

    return (
        <Container fluid style={{ marginBottom: '.5rem', marginTop: '5rem', maxWidth: '1200px' }}>
            <Navigation />
                <Row>
                    <Col xs="12"><span className="pull-left"><Icon name="arrow-left" className="pr-1"/><Link to="/intermittentsview.html">back</Link></span></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto pt-3"><h1>Details for Bug bugID</h1></Col>
                </Row>
                <Row>
                    <Col xs="12" className="mx-auto pb-5"><h2>{`${from} to ${to}`}</h2></Col>
                </Row>
                <GenericTable columns={columns} trStyling={false}/>
            {/* {bugs && failureMessage === '' ?
                <GenericTable bugs={bugs}/> : <p>{failureMessage}</p>} */}
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
});

const mapDispatchToProps = dispatch => ({
    fetchData: url => dispatch(fetchBugData(url))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugDetailsView);
