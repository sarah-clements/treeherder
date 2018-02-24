import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateSelectedBugDetails, updateDateRange, updateTreeName } from "./../redux/actions";
import { bugzillaBugsApi } from "../helpers";

class BugColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayBugDetails: false,
        };
        this.displayBugText = this.displayBugText.bind(this);
        this.updateStateData = this.updateStateData.bind(this);
    }

    displayBugText() {
        this.setState({ displayBugDetails: !this.state.displayBugDetails });
    }

    updateStateData() {
        // bugdetailsview inherits data from the main view
        const { data, updateDates, updateTree, updateBugDetails, from, to, ISOfrom, ISOto, tree } = this.props;
        updateBugDetails(data.id, data.summary, data.count, "BUG_DETAILS");
        updateTree(tree, "BUG_DETAILS");
        updateDates(from, to, ISOfrom, ISOto, "BUG_DETAILS");
    }

    render() {
        const { tree, ISOfrom, ISOto } = this.props;
        const { id } = this.props.data;
        return (
            <div onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
                <span className="text-primary">{id}</span><span className={`ml-1 small-text ${this.state.displayBugDetails ? "" : "hidden"}`}>
                    <Link onClick={this.updateStateData} to={{ pathname: "/bugdetails", search: `?startday=${ISOfrom}&endday=${ISOto}&tree=${tree}&bug=${id}` }}>
                        details
                    </Link>
                    <a className="ml-1" target="_blank" href={bugzillaBugsApi("bugshow_bug.cgi", { id })}>bugzilla</a>
                </span>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    from: state.dates.from,
    to: state.dates.to,
    ISOfrom: state.dates.ISOfrom,
    ISOto: state.dates.ISOto,
    tree: state.mainTree.tree
});

const mapDispatchToProps = dispatch => ({
    updateBugDetails: (bugId, summary, bugCount, name) => dispatch(updateSelectedBugDetails(bugId, summary, bugCount, name)),
    updateDates: (from, to, ISOfrom, ISOto, name) => dispatch(updateDateRange(from, to, ISOfrom, ISOto, name)),
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugColumn);
