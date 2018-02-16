import React from "react";
import { Table } from "reactstrap";
import ReactTable from "react-table";
import "react-table/react-table.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchBugData } from "../redux/actions";
import { apiUrlFormatter } from "../helpers";

class GenericTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.updateData = this.updateData.bind(this);
    }

    updateData(state) {
        let search;
        if (state.filtered.length > 0) {
            search = state.filtered[0].value;
        }
        const page = state.page + 1;
        const { fetchData, tableName, tree, tableApi, ISOfrom, ISOto, bugId } = this.props;
        let url = apiUrlFormatter(tableApi, ISOfrom, ISOto, tree, bugId, page, search);
        fetchData(url, tableName);
    }

    bugRowStyling(state, bug) {
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
    }

    render() {
        let { bugs, columns, trStyling, totalPages } = this.props;
        //if dynamic table row styling based on bug status/whiteboard is not needed, pass the trStyling prop a false bool
        return (
            <ReactTable
                        manual
                        data={bugs}
                        onFetchData={this.updateData}
                        pages={totalPages}
                        showPageSizeOptions={false}
                        columns={columns}
                        className="-striped"
                        getTrProps={trStyling ? this.bugRowStyling : () => ({})}
            />
        );
    }
}

Table.propTypes = {
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    hover: PropTypes.bool,
    responsive: PropTypes.bool
};

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
});

export default connect(null, mapDispatchToProps)(GenericTable);
