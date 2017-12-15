import React from 'react';
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { setTimeout } from 'timers';

export default class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: undefined,
            to: undefined,
        };
        this.fromChange = this.fromChange.bind(this);
        this.toChange = this.toChange.bind(this);
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

    render() {
        const today = new Date();
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        return (
            <div className="InputFromTo float-left">
                <DayPickerInput
                                value={from}
                                placeholder="From"
                                format="LL"
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
                                format="LL"
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
            </div>
        );
    }
}
