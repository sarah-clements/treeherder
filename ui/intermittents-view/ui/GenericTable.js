import React from 'react';
import { Table } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
import BugColumn from './BugColumn';
const _ = require('lodash');

class GenericTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.bugStatus = this.bugStatus.bind(this);
    }

    bugStatus(state, bug) {
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
        let { bugs } = this.props;
        bugs = _.map(bugs);
        const columns = [
              {
                Header: "BugID",
                accessor: "id",
                Cell: props => <BugColumn dataId={props.value}/>
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
            <ReactTable
                        data={bugs}
                        columns={columns}
                        className="-striped"
                        getTrProps={this.bugStatus}
                        />
            // <div className="table-responsive-sm">
            //     <Table bordered striped>
            //         <thead>
            //             <tr>
            //                 <th>Bug ID</th>
            //                 <th>Count</th>
            //                 <th className="text-truncate">Summary</th>
            //                 <th>Whiteboard</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {Object.entries(bugs).map((data, index) =>
            //             <tr className={this.bugStatus(data[1])} key={index}>
            //                 <BugColumn dataId={data[1].id} />
            //                 {/* second category should be count*/}
            //                 <td></td>
            //                 <td className="text-left">{data[1].summary}</td>
            //                 <td>{data[1].whiteboard}</td>
            //             </tr>)}
            //         </tbody>
            // </Table>
            // </div>
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
