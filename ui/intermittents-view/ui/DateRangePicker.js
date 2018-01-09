import React from 'react';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { parseDate, formatDate } from 'react-day-picker/moment';
import { setTimeout } from 'timers';
import { Button } from 'reactstrap';

export default class DateRangePicker extends React.Component {
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
        console.log(this.state.from + " " + this.state.to);
    }

    render() {
        const today = new Date();
        const { from, to } = this.state;
        const { defaultTo, defaultFrom } = this.props;
        const modifiers = { start: from, end: to };
        return (
            <div className="InputFromTo row justify-content-center table-controls">
                <DayPickerInput
                                value={from}
                                placeholder={defaultFrom}
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
                                placeholder={defaultTo}
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
                    <Button color="secondary" className="ml-2" onClick={this.updateData}>Update</Button>
            </div>
        );
    }
}
