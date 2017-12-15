import React from 'react';
import PropTypes from 'prop-types';
import {
    Collapse,
    // ControlLabel,
    // FormGroup,
    Navbar,
    // NavItem,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false,
                        value: null,
                        formattedvalue: null };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
    this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        return (
            <Navbar expand fixed="top" className="top-navbar">
                <span className="lightorange">Intermittents View </span>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav navbar className="mr-auto"></Nav>
                    <UncontrolledDropdown>
                        <DropdownToggle className="btn-navbar navbar-link" nav caret>
                            Tree
                        </DropdownToggle>
                        <DropdownMenu >
                            <DropdownItem>
                            Trunk
                            </DropdownItem>
                            <DropdownItem>
                            Autoland
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Collapse>
            </Navbar>
        );
    }
}

Nav.propTypes = {
    caret: PropTypes.bool,
};
