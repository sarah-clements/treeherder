import React from "react";
import { Table } from "reactstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchBugData, fetchBugsThenBugzilla } from "../redux/actions";
import { treeherderDomain } from "../constants";
import { createApiUrl } from "../helpers";

const GenericTable = ({ fetchData, fetchFullBugData, name, params, bugId, tableApi, bugs, columns, trStyling, totalPages }) => {

    const updateTable = (state) => {
        // table's page count starts at 0
        const page = state.page + 1;
        updateData(page);
    };

    const updateData = (page) => {
        params.page = page;
        if (bugId) {
            fetchData(createApiUrl(treeherderDomain, tableApi, params), name);
        } else {
            fetchFullBugData(createApiUrl(treeherderDomain, tableApi, params), name);
        }
    };

    const bugRowStyling = (state, bug) => {
        if (bug) {
            let style = { color: "#aaa" };

            if (bug.row.status === "RESOLVED" || bug.row.status === "VERIFIED") {
                style.textDecoration = "line-through";
                return { style };
            }

            let disabledStrings = new RegExp("(disabled|annotated|marked)", "i");
            if (disabledStrings.test(bug.row.whiteboard)) {
                return { style };
            }
        }
        return {};
    };
    return (
        <ReactTable
                    manual
                    data={bugs}
                    onFetchData={updateTable}
                    pages={totalPages}
                    showPageSizeOptions={false}
                    columns={columns}
                    className="-striped"
                    getTrProps={trStyling ? bugRowStyling : () => ({})}
        />
    );
};

Table.propTypes = {
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool
};

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    fetchFullBugData: (url, name) => dispatch(fetchBugsThenBugzilla(url, name)),
});

export default connect(null, mapDispatchToProps)(GenericTable);