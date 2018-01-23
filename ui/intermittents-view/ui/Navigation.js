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
import { apiUrlFormatter } from '../helpers';

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isOpen: false,
                        tree: "trunk"
                    };

        this.toggle = this.toggle.bind(this);
        this.changeTree = this.changeTree.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    changeTree(event) {
        const { tree } = this.state;
        const selectedText = event.target.innerText;

        if (selectedText !== tree) {
            this.setState({ tree: selectedText }, () => this.updateData(selectedText));
        }
    }

    updateData(treeName) {
        const { updateTree, fetchData, name, ISOfrom, ISOto, endpoint } = this.props;
        let url = apiUrlFormatter(endpoint, ISOfrom, ISOto, treeName);
        fetchData(url, name);
        updateTree(treeName, name);
    }

    render() {
        const { tree, isOpen } = this.state;
        const treeOptions = ["trunk", "autoland"];
        return (
            <Navbar expand fixed="top" className="top-navbar">
                <span className="lightorange">Intermittents View </span>
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar></Nav>
                    <UncontrolledDropdown>
                        <DropdownToggle className="btn-navbar navbar-link" nav caret>
                            Tree
                        </DropdownToggle>
                        <DropdownMenu >
                            {treeOptions.map((item, index) =>
                            <DropdownItem key={index} onClick={this.changeTree}>
                                <Icon name="check" className={`pr-1 ${tree === item ? "" : "hidden"}`}/>
                                {item}
                            </DropdownItem>)}
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
