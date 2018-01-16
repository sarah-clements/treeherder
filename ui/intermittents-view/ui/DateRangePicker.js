import React from 'react';
import 'react-day-picker/lib/style.css';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { parseDate, formatDate } from 'react-day-picker/moment';
import { setTimeout } from 'timers';
import { Button } from 'reactstrap';
import { formatDates, apiUrlFormatter } from '../helpers';
import { fetchBugData, updateDateRange } from './../redux/actions';
import moment from 'moment';

export class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: undefined,
            to: undefined,
        };
        this.fromChange = this.fromChange.bind(this);
        this.toChange = this.toChange.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    focusTo() {
        this.timeout = setTimeout(() => this.to.getInput().focus(), 0);
    }

    showFromMonth() {
        const from = this.state.from;
        if (!from) {
            return;
        }
        this.to.getDayPicker().showMonth(from);
    }

    fromChange(from) {
        this.setState({ from }, () => {
            if (!this.state.to) {
                this.focusTo();
            }
        });
    }

    toChange(to) {
        this.setState({ to }, this.showFromMonth);
    }

    updateData() {
        const [ISOto, to] = formatDates(moment(this.state.to), null);
        const [ISOfrom, from] = formatDates(moment(this.state.from), null);
        this.props.fetchData(apiUrlFormatter('bugs', ISOfrom, ISOto, 'tree'));
        this.props.updateDates(from, to, this.props.name);
    }

    render() {
        const today = new Date();
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };

        return (
            <div className="InputFromTo py-5 d-inline-block">
                <DayPickerInput
                                value={from}
                                placeholder="From"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                format="ddd MMM D, YYYY"
                                dayPickerProps={{
                                    selectedDays: [from, { from, to }],
                                    disabledDays: { after: today },
                                    toMonth: to,
                                    modifiers,
                                    numberOfMonths: 2
                                }}
                                onDayChange={this.fromChange} />
                <span className="ml-1 mr-1">-</span>
                <span className="InputFromTo-to">
                    <DayPickerInput
                                ref={element => (this.to = element)}
                                value={to}
                                placeholder="To"
                                formatDate={formatDate}
                                parseDate={parseDate}
                                format="ddd MMM D, YYYY"
                                dayPickerProps={{
                                    selectedDays: [from, { from, to }],
                                    disabledDays: { after: today },
                                    month: from,
                                    fromMonth: from,
                                    modifiers,
                                    numberOfMonths: 2
                                }}
                                onDayChange={this.toChange} />
                </span>
                    <Button color="secondary" className="ml-2" onClick={this.updateData}>update</Button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchData: url => dispatch(fetchBugData(url)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name))
});

export default connect(null, mapDispatchToProps)(DateRangePicker);
