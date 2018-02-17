import React from "react";
import { ButtonDropdown, DropdownToggle } from "reactstrap";
import { connect } from "react-redux";
import moment from "moment";
import DateRangePicker from "./DateRangePicker";
import { fetchBugData, updateDateRange } from "./../redux/actions";
import { formatDates, apiUrlFormatter } from "../helpers";
import DropdownMenuItems from "./DropdownMenuItems";

class DateOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            dateRange: ""
        };
        this.toggle = this.toggle.bind(this);
        this.updateData = this.updateData.bind(this);
        this.updateDateRange = this.updateDateRange.bind(this);
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    updateDateRange(dateRange) {
        this.setState({ dateRange });
        if (dateRange === "custom range") {
            return;
        }
        let from;
        if (dateRange === "last 7 days") {
            from = 7;
        } else if (dateRange === "last 30 days") {
            from = 30;
        } else {
            // bug history is max 4 months
            from = 120;
        }
        this.updateData(from);
    }

    updateData(fromDate) {
        const today = moment().utc();
        const { fetchData, updateDates, name, graphName, tree, tableApi, graphApi, bugId } = this.props;
        const [ISOto, to] = formatDates(today);
        const [ISOfrom, from] = formatDates(today.subtract(fromDate, "days"));
        fetchData(apiUrlFormatter(tableApi, ISOfrom, ISOto, tree, bugId), name);
        fetchData(apiUrlFormatter(graphApi, ISOfrom, ISOto, tree, bugId), graphName);
        updateDates(from, to, name);
    }

    render() {
        const { name, graphName, tree, tableApi, graphApi, bugId } = this.props;
        const { dropdownOpen, dateRange } = this.state;
        const dateOptions = ["last 7 days", "last 30 days", "custom range", "entire history"];

        return (
        <div className="d-inline-block">
            <ButtonDropdown className="mr-3" isOpen={dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    date range
                </DropdownToggle>
                <DropdownMenuItems options={dateOptions} updateData={this.updateDateRange} />
            </ButtonDropdown>
        {dateRange === "custom range" &&
        <DateRangePicker tree={tree} tableApi={tableApi} graphApi={graphApi} name={name}
                         graphName={graphName} bugId={bugId}
        />}
        </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name))
});

export default connect(null, mapDispatchToProps)(DateOptions);
