import React from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import Icon from 'react-fontawesome';
import ReactTable from 'react-table';

import { calculateMetrics, prettyDate, tableRowStyling } from './helpers';
import { bugDetailsEndpoint, getJobsUrl, createApiUrl } from '../helpers/url';
import BugLogColumn from './BugLogColumn';
import Layout from './Layout';
import withView from './View';
import DateOptions from './DateOptions';

const defaultState = {
  route: '/bugdetails',
  endpoint: bugDetailsEndpoint,
};

const BugDetailsView = (props) => {
  const { graphData, tableData, initialParamsSet, startday, endday, updateState, bug, tree, page, pageSize,
    summary, errorMessages, lastLocation, tableFailureStatus, graphFailureStatus, getTableData } = props;

    const columns = [
    {
      Header: 'Push Time',
      accessor: 'push_time',
    },
    {
      Header: 'Tree',
      accessor: 'tree',
    },
    {
      Header: 'Revision',
      accessor: 'revision',
      Cell: _props =>
        (<a
          href={getJobsUrl({ repo: _props.original.tree, revision: _props.value, selectedJob: _props.original.job_id })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {_props.value}
        </a>),
    },
    {
      Header: 'Platform',
      accessor: 'platform',
    },
    {
      Header: 'Build Type',
      accessor: 'build_type',
    },
    {
      Header: 'Test Suite',
      accessor: 'test_suite',
      minWidth: 150,
    },
    {
      Header: 'Machine Name',
      accessor: 'machine_name',
      minWidth: 125,
    },
    {
      Header: 'Log',
      accessor: 'job_id',
      Cell: props => <BugLogColumn {...props} />,
      minWidth: 110,
    },
  ];

  let graphOneData = null;
  let graphTwoData = null;

  if (graphData.length > 0) {
    ({ graphOneData, graphTwoData } = calculateMetrics(graphData));
  }

  const updateTable = (state) => {
    if (state.page + 1 !== page || state.pageSize !== pageSize) {
      updateState({ page: state.page + 1, pageSize: state.pageSize }, true);
    } else if (state.sorted.length > 0) {
      const params = { bug, startday, endday, tree, page, page_size: pageSize, column: state.sorted[0].id, desc: state.sorted[0].desc };
      getTableData(createApiUrl(defaultState.endpoint, params));
    }
  };

  return (
    <Layout
      {...props}
      graphOneData={graphOneData}
      graphTwoData={graphTwoData}
      dateOptions
      header={
        <React.Fragment>
          <Row>
            <Col xs="12"><span className="pull-left"><Link to={(lastLocation || '/')}><Icon name="arrow-left" className="pr-1" />
              back</Link></span>
            </Col>
          </Row>
          {!errorMessages.length && !tableFailureStatus && !graphFailureStatus &&
          <React.Fragment>
            <Row>
              <Col xs="12" className="mx-auto"><h1>Details for Bug {!bug ? '' : bug}</h1></Col>
            </Row>
            <Row>
              <Col xs="12" className="mx-auto"><p className="subheader">{`${prettyDate(startday)} to ${prettyDate(endday)} UTC`}</p>
              </Col>
            </Row>
            {summary &&
            <Row>
              <Col xs="4" className="mx-auto"><p className="text-secondary text-center">{summary}</p></Col>
            </Row>}
            {tableData && tableData.count &&
            <Row>
              <Col xs="12" className="mx-auto"><p className="text-secondary">{tableData.count} total failures</p></Col>
            </Row>}
          </React.Fragment>}
        </React.Fragment>
      }
      table={
        bug && initialParamsSet &&
        <ReactTable
          manual
          data={tableData.results}
          onFetchData={state => updateTable(state)}
          pages={tableData.total_pages}
          showPageSizeOptions
          columns={columns}
          className="-striped"
          getTrProps={tableRowStyling}
          showPaginationTop
        />
      }
      datePicker={
        <DateOptions
          updateState={updateState}
        />
      }
    />
  );
};

export default withView(defaultState)(BugDetailsView);
