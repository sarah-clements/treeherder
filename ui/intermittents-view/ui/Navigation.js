import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateTreeName, fetchBugData } from './../redux/actions';
import {
    Collapse,
    Navbar,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';
import Icon from 'react-fontawesome';
import { apiUrlFormatter } from '../constants';

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false,
                        trunk: true,
                        autoland: false
                    };

        this.toggle = this.toggle.bind(this);
        this.changeTree = this.changeTree.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    changeTree(event) {
        const { autoland, trunk } = this.state;
        let treeName = 'trunk';

        if (event.target.innerText === 'Autoland') {
            treeName = 'autoland';
        }
        if (this.props.tree !== treeName) {
            this.setState({ autoland: !autoland, trunk: !trunk }, () => this.updateData(treeName));
        }
    }

    updateData(treeName) {
        const { updateTree, fetchData, name, ISOfrom, ISOto, endpoint } = this.props;
        let url = apiUrlFormatter(endpoint, ISOfrom, ISOto, treeName);
        fetchData(url, name);
        updateTree(treeName, name);
    }

    render() {
        const { trunk, autoland } = this.state;
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
                                <Icon name="check ml-1" className={`pr-1 ${trunk ? "" : "hidden"}`}/>
                                Trunk
                            </DropdownItem>
                            <DropdownItem onClick={this.changeTree}>
                                <Icon name="check ml-1" className={`pr-1 ${autoland ? "" : "hidden"}`}/>
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

const mapStateToProps = state => ({
    tree: state.mainTree.tree
});

const mapDispatchToProps = dispatch => ({
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name)),
    fetchData: (url, name) => dispatch(fetchBugData(url, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
