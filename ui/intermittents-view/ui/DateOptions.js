import React from "react";
import { ButtonDropdown, DropdownToggle } from "reactstrap";
import DateRangePicker from "./DateRangePicker";
import { formatDates, apiUrlFormatter } from "../helpers";
import { connect } from "react-redux";
import { fetchBugData, updateDateRange } from "./../redux/actions";
import moment from "moment";
import DropdownMenuItems from './DropdownMenuItems';

class DateOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            dateRange: ""
        };
        this.toggle = this.toggle.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    updateData(dateRange) {
        this.setState({ dateRange });

        const today = moment();
        let from;
        let ISOfrom;
        if (dateRange === "last 7 days") {
            from = 7;
        } else if (dateRange === "last 30 days") {
            from = 30;
        } else {
            // bug history (max 4 months) for initial query
            from = 120;
        }
        const [ISOto, to] = formatDates(today);
        [ISOfrom, from] = formatDates(today.subtract(from, "days"));
        this.props.fetchData(apiUrlFormatter("bybug", ISOfrom, ISOto, "tree"), "BUG_DETAILS");
        this.props.updateDates(from, to, "BUG_DETAILS");
    }

    render() {
        const { dropdownOpen, dateRange } = this.state;
        const dateOptions = ["last 7 days", "last 30 days", "custom range", "entire history"];

        return (
        <div className="d-inline-block">
            <ButtonDropdown className="mr-3" isOpen={dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    date range
                </DropdownToggle>
                <DropdownMenuItems options={dateOptions} updateData={this.updateData} />
            </ButtonDropdown>
        {dateRange === "custom range" &&
        <DateRangePicker name="BUG_DETAILS" />}
        </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name))
});

export default connect(null, mapDispatchToProps)(DateOptions);
