import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateSelectedBugDetails, updateDateRange, updateTreeName } from "./../redux/actions";

class BugColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayBugDetails: false,
        };
        this.displayBugText = this.displayBugText.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    displayBugText() {
        this.setState({ displayBugDetails: !this.state.displayBugDetails });
    }

    updateData() {
        const { data, updateDates, updateTree, updateBugDetails, from, to, tree } = this.props;
        updateBugDetails(data.id, data.summary, "BUG_DETAILS");
        updateTree(tree, "BUG_DETAILS");
        updateDates(from, to, "BUG_DETAILS");
    }

    render() {
        const { tree, ISOfrom, ISOto } = this.props;
        const { id } = this.props.data;
        const bugzillaBugUrl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
        return (
            <div onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
                <span className="text-primary">{id}</span><span className={`ml-1 small-text ${this.state.displayBugDetails ? "" : "hidden"}`}>
                    <Link onClick={this.updateData} to={{ pathname: "/bugdetails", search: `?startday=${ISOfrom}&endday=${ISOto}&tree=${tree}&bug=${id}` }}>
                        details
                    </Link>
                    <a className="ml-1" target="_blank" href={bugzillaBugUrl + id}>bugzilla</a>
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
    updateBugDetails: (bugId, summary, name) => dispatch(updateSelectedBugDetails(bugId, summary, name)),
    updateDates: (from, to, name) => dispatch(updateDateRange(from, to, name)),
    updateTree: (tree, name) => dispatch(updateTreeName(tree, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BugColumn);
