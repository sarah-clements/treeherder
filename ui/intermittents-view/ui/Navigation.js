import React from 'react';
import PropTypes from 'prop-types';
import {
    Collapse,
    Navbar,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false,
                        tree: 'trunk',
                    };

        this.toggle = this.toggle.bind(this);
        this.changeTree = this.changeTree.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    changeTree(event) {
        let tree = 'trunk';
        if (event.target.innerText === 'Autoland') {
            tree = 'autoland';
        }
        if (this.state.tree !== tree) {
            this.setState({ tree });
        }
    }

    render() {
        return (
            <Navbar expand fixed="top" className="top-navbar">
                <span className="lightorange">Intermittents View </span>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav navbar></Nav>
                    <UncontrolledDropdown>
                        <DropdownToggle className="btn-navbar navbar-link" nav caret>
                            Tree
                        </DropdownToggle>
                        <DropdownMenu >
                            <DropdownItem onClick={this.changeTree}>
                            Trunk (default)
                            </DropdownItem>
                            <DropdownItem onClick={this.changeTree}>
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
