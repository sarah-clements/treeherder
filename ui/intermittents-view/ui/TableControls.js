import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
         InputGroup, Input, InputGroupAddon } from 'reactstrap';
import DateRangePicker from './DateRangePicker';
import PropTypes from 'prop-types';

export default class TableControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          dropdownOpen: false
        };
        this.toggleDropdown = this.toggleDropdown.bind(this);
    };

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    render() {
        return (
            <div className="row justify-content-start table-controls">
                <div className="col-7 pl-0">
                    <DateRangePicker />
                </div>
                <div className="col ml-auto pr-0">
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                    <DropdownToggle caret>
                    Filter
                    </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>All</DropdownItem>
                            <DropdownItem>Whiteboard</DropdownItem>
                        </DropdownMenu>
                </ButtonDropdown>
                </div>
                <div className="col px-0">
                    <InputGroup>
                        <Input placeholder="Search..." />
                        <InputGroupAddon>Go</InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
        );
    }
}

ButtonDropdown.propTypes = {
    disabled: PropTypes.bool,
    dropup: PropTypes.bool,
    group: PropTypes.bool,
    isOpen: PropTypes.bool,
    tag: PropTypes.string,
    toggle: PropTypes.func
  };

  DropdownToggle.propTypes = {
    caret: PropTypes.bool,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    'data-toggle': PropTypes.string,
    'aria-haspopup': PropTypes.bool
  };
