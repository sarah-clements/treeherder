import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Collapse, Navbar, Nav, UncontrolledDropdown, DropdownToggle } from "reactstrap";
import { updateTreeName, fetchBugData } from "./../redux/actions";
import { apiUrlFormatter } from "../helpers";
import DropdownMenuItems from "./DropdownMenuItems";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };

        this.toggle = this.toggle.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }


    updateData(tree) {
        const { fetchData, updateTree, name, graphName, ISOfrom, ISOto, tableApi, graphApi, bugId } = this.props;
        fetchData(apiUrlFormatter(tableApi, ISOfrom, ISOto, tree, bugId), name);
        fetchData(apiUrlFormatter(graphApi, ISOfrom, ISOto, tree, bugId), graphName);
        updateTree(tree, name);
    }

    render() {
        const treeOptions = ["trunk", "autoland"];
        return (
            <Navbar expand fixed="top" className="top-navbar">
                <span className="lightorange">Intermittents View </span>
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav navbar />
                    <UncontrolledDropdown>
                        <DropdownToggle className="btn-navbar navbar-link" nav caret>
                            Tree
                        </DropdownToggle>
                        <DropdownMenuItems options={treeOptions} updateData={this.updateData} default={this.props.tree} />
                    </UncontrolledDropdown>
                </Collapse>
            </Navbar>
        );
    }
}

Nav.propTypes = {
    caret: PropTypes.bool,
};

// not using mapStateToProps because this component is being used for different views
// with two different slices of the state (for trees)

const mapDispatchToProps = dispatch => ({
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name)),
    fetchData: (url, name) => dispatch(fetchBugData(url, name))
});

export default connect(null, mapDispatchToProps)(Navigation);
