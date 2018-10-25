import React from 'react';
import PropTypes from 'prop-types';

import { updateQueryParams, validateQueryParams, getData, mergeData, formatBugs } from './helpers';
import { graphsEndpoint, parseQueryParams, createQueryParams, createApiUrl,
  bugzillaBugsApi } from '../helpers/url';

const withView = defaultState => WrappedComponent =>
  class View extends React.Component {
    constructor(props) {
    super(props);

    this.updateData = this.updateData.bind(this);
    this.setQueryParams = this.setQueryParams.bind(this);
    this.checkQueryValidation = this.checkQueryValidation.bind(this);
    this.getTableData = this.getTableData.bind(this);
    this.getGraphData = this.getGraphData.bind(this);
    this.updateState = this.updateState.bind(this);
    this.getBugDetails = this.getBugDetails.bind(this);

    this.default = (this.props.location.state || defaultState);
    this.state = {
      errorMessages: [],
      initialParamsSet: false,
      tree: (this.default.tree || null),
      startday: (this.default.startday || null),
      endday: (this.default.endday || null),
      bug: (this.default.id || null),
      summary: (this.default.summary || null),
      tableData: {},
      tableFailureStatus: null,
      isFetchingTable: false,
      graphData: [],
      graphFailureStatus: null,
      isFetchingGraphs: false,
      page: 0,
      pageSize: 20,
      lastLocation: (this.default.location || null),
    };
  }

  componentDidMount() {
    this.setQueryParams();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    // update all data if the user edits dates, tree or bug via the query params
    if (prevProps.location.search !== location.search) {
      this.checkQueryValidation(parseQueryParams(location.search), this.state.initialParamsSet);
    }
  }

  setQueryParams() {
    const { location, history } = this.props;
    const { startday, endday, tree, bug } = this.state;
    const params = { startday, endday, tree };

    if (bug) {
      params.bug = bug;
    }

    if (location.search !== '' && !location.state) {
      // update data based on the params or show error if params are missing
      this.checkQueryValidation(parseQueryParams(location.search));
    } else {
      // if the query params are not specified for mainview, set params based on default state
      if (location.search === '') {
        const queryString = createQueryParams(params);
        updateQueryParams(defaultState.route, queryString, history, location);
      }

      this.setState({ initialParamsSet: true });
      this.getGraphData(createApiUrl(graphsEndpoint, params));
      this.getTableData(createApiUrl(defaultState.endpoint, params));
    }
  }

  async getBugDetails(url) {
    const { data, failureStatus } = await getData(url);
    if (!failureStatus && data.bugs.length === 1) {
      this.setState({ summary: data.bugs[0].summary });
    }
  }

  async getTableData(url) {
    this.setState({ tableFailureStatus: null, isFetchingTable: true });
    const { data, failureStatus } = await getData(url);

    if (defaultState.route === '/main' && !failureStatus && data.length) {
      const bugIds = formatBugs(data);
      const bugzillaData = await this.batchBugRequests(bugIds);
      const results = mergeData(data, bugzillaData);
      data.results = results;
    }

    this.setState({ tableData: data.results, tableFailureStatus: failureStatus, isFetchingTable: false });
  }

  async getGraphData(url) {
    this.setState({ graphFailureStatus: null, isFetchingGraphs: true });
    const { data, failureStatus } = await getData(url);
    this.setState({ graphData: data, graphFailureStatus: failureStatus, isFetchingGraphs: false });
  }

  async batchBugRequests(bugIds) {
    const urlParams = {
      include_fields: 'id,status,summary,whiteboard',
    };

    let min = 0;
    let max = 800;
    let bugsList = [];

    while (bugIds.length >= min) {
      const batch = bugIds.slice(min, max + 1);
      urlParams.id = batch.join();
      const results = await getData(bugzillaBugsApi('bug', urlParams)); // eslint-disable-no-await-in-loop

      if (results.data.bugs.length) {
        bugsList = [...bugsList, ...results.data.bugs];
      }
      min = max;
      max += 800;
    }
    return bugsList;
  }

  updateState(updatedObj, updateTable = false) {
    this.setState(updatedObj, () => {
      const { startday, endday, tree, page, pageSize, bug } = this.state;
      const params = { startday, endday, tree, page, page_size: pageSize };

      if (bug) {
        params.bug = bug;
      }

      if (!updateTable) {
        this.getGraphData(createApiUrl(graphsEndpoint, params));
      }
      this.getTableData(createApiUrl(defaultState.endpoint, params));

      // update query params if dates or tree are updated
      const queryString = createQueryParams(params);
      updateQueryParams(defaultState.route, queryString, this.props.history, this.props.location);
    });
  }

  updateData(params, urlChanged = false) {
    const { mainGraphData } = this.props;

    if (mainGraphData && !urlChanged) {
      this.setState({ graphData: mainGraphData });
    } else {
      this.getGraphData(createApiUrl(graphsEndpoint, params));
    }

    // the table library fetches data directly when its component mounts and in response
    // to a user selecting pagesize or page; this condition will prevent duplicate requests
    // when this component mounts and when the table mounts in bugdetails view.
    if (urlChanged || defaultState.route === '/main') {
      this.getTableData(createApiUrl(defaultState.endpoint, params));
    }

    if (params.bug && Object.keys(this.state.tableData).length) {
      this.getBugDetails(bugzillaBugsApi('bug', { include_fields: 'summary', id: params.bug }));
    }
  }

  checkQueryValidation(params, urlChanged = false) {
    const { errorMessages, initialParamsSet, summary } = this.state;
    const messages = validateQueryParams(params, defaultState.route === '/bugdetails');
    const updates = {};

    if (messages.length > 0) {
      this.setState({ errorMessages: messages });
    } else {
      if (errorMessages.length) {
        updates.errorMessages = [];
      }
      if (!initialParamsSet) {
        updates.initialParamsSet = true;
      }
      if (summary) {
        // reset summary
        updates.summary = null;
      }

      this.setState({ ...updates, ...params });
      this.updateData(params, urlChanged);
    }
  }

  render() {
    const methods = { updateState: this.updateState, getTableData: this.getTableData };
    const newProps = { ...this.props, ...this.state, ...methods };
    return (
      <WrappedComponent {...newProps} />
    );
  }
};

withView.propTypes = {
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default withView;
