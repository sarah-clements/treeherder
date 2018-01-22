import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Icon from 'react-fontawesome';
import DateRangePicker from './DateRangePicker';

export default class Example extends React.Component {
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

        if (selectedText !== rangeSelected) {
            this.setState({ rangeSelected: selectedText });
            // this.setState({ rangeSelected: selectedText }, () => this.updateData(treeName));
        }
    }

    render() {
        const { dropdownOpen, rangeSelected } = this.state;
        const dateOptions = ["last 7 days", "last 30 days", "custom range", "entire history"];

        return (
        <div className="d-inline-block pb-5">
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
