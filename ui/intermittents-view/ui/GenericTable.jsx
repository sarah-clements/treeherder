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
            pageNum: 1
        };
        this.updateData = this.updateData.bind(this);
        this.navigateTable = this.navigateTable.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchInput !== this.props.searchInput) {
            this.updateData(this.state.pageNum, nextProps.searchInput);
        }
    }

    navigateTable(state) {
        // table's page count starts at 0
        const pageNum = state.page + 1;
        this.setState({ pageNum }, () => this.updateData(pageNum, this.props.searchInput));
    }

    updateData(page, search) {
        const { fetchData, name, tree, tableApi, ISOfrom, ISOto, bugId } = this.props;
        fetchData(apiUrlFormatter(tableApi, ISOfrom, ISOto, tree, bugId, page, search), name);
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
                        onFetchData={this.navigateTable}
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
