import React from 'react';
import { Table } from 'reactstrap';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import BugColumn from './BugColumn';

class GenericTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    bugStatus(bug) {
        let disabledStrings = new RegExp('(disabled|annotated|marked)', 'i');
        if (bug.status === "RESOLVED" || bug.status === "VERIFIED") {
            return 'resolved-bug';
        } else if (disabledStrings.test(bug.whiteboard)) {
            return 'disabled-bug';
        }
    };

    render() {
        const { bugs } = this.props;
        return (
            <div className="table-responsive-sm">
                <Table bordered striped>
                    <thead>
                        <tr>
                            <th>Bug ID</th>
                            <th>Count</th>
                            <th className="text-truncate">Summary</th>
                            <th>Whiteboard</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(bugs).map((data, index) =>
                        <tr className={this.bugStatus(data[1])} key={index}>
                            <BugColumn dataId={data[1].id} />
                            {/* second category should be count*/}
                            <td></td>
                            <td className="text-left">{data[1].summary}</td>
                            <td>{data[1].whiteboard}</td>
                        </tr>)}
                    </tbody>
            </Table>
            </div>
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
