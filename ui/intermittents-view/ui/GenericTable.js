import React from 'react';
import { Table } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
const _ = require('lodash');

class GenericTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    bugRowStyling(state, bug) {
        if (bug) {
            let style = { color: '#aaa' };

            if (bug.row.status === "RESOLVED" || bug.row.status === "VERIFIED") {
                style['textDecoration'] = 'line-through';
                return { style };
            }

            let disabledStrings = new RegExp('(disabled|annotated|marked)', 'i');
            if (disabledStrings.test(bug.row.whiteboard)) {
                return { style };
            }
        }
        return {};
    };

    render() {
        let { bugs, columns, trStyling } = this.props;
        //if dynamic table row styling based on bug status/whiteboard is not needed, pass the trStyling prop a false bool
        bugs = _.map(bugs);
        return (
            <ReactTable
                        data={bugs}
                        columns={columns}
                        className="-striped"
                        getTrProps={trStyling ? this.bugRowStyling : () => ({})}
                        />
        );
    }
};

Table.propTypes = {
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool
};

export default GenericTable;
