import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Icon from 'react-fontawesome';
import DateRangePicker from './DateRangePicker';
import { formatDates, apiUrlFormatter } from '../helpers';
import { connect } from 'react-redux';
import { fetchBugData, updateDateRange } from './../redux/actions';
import moment from 'moment';

class DateOptions extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            rangeSelected: ""
        };
        this.toggle = this.toggle.bind(this);
        this.changeDateRange = this.changeDateRange.bind(this);
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    changeDateRange(event) {
        const { rangeSelected } = this.state;
        const selectedText = event.target.innerText;

        // custom range is handled by the DateRangePicker component
        if (selectedText !== rangeSelected && selectedText === "custom range") {
            this.setState({ rangeSelected: selectedText });
        } else if (selectedText !== rangeSelected) {
            this.setState({ rangeSelected: selectedText }, () => this.updateData(selectedText));
        }
    }

    updateData(dateRange) {
        const today = moment();
        let from;
        let ISOfrom;
        if (dateRange === "last 7 days") {
            from = 7;
        } else if (dateRange === "last 30 days") {
            from = 30;
        } else {
            // dateRange === "entire history" TBD
            return;
        }
        const [ISOto, to] = formatDates(today);
        [ISOfrom, from] = formatDates(today.subtract(from, "days"));
        this.props.fetchData(apiUrlFormatter('bugs', ISOfrom, ISOto, 'tree'), "BUG_DETAILS");
        this.props.updateDates(from, to, "BUG_DETAILS");
    }

    render() {
        const { dropdownOpen, rangeSelected } = this.state;
        const dateOptions = ["last 7 days", "last 30 days", "custom range", "entire history"];

        return (
        <div className="d-inline-block">
            <ButtonDropdown className="mr-3" isOpen={dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    date range
                </DropdownToggle>
                <DropdownMenu>
                    {dateOptions.map((item, index) =>
                    <DropdownItem key={index} onClick={this.changeDateRange}>
                        <Icon name="check" className={`pr-1 ${rangeSelected === item ? "" : "hidden"}`}/>
                        {item}
                    </DropdownItem>)}
                </DropdownMenu>
            </ButtonDropdown>
        {rangeSelected === "custom range" &&
        <DateRangePicker name='BUG_DETAILS' />}
        </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchData: (url, name) => dispatch(fetchBugData(url, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name))
});

export default connect(null, mapDispatchToProps)(DateOptions);
