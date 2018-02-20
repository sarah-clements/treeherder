import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class BugColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayBugDetails: false,
        };
        this.displayBugText = this.displayBugText.bind(this);
    }

    displayBugText() {
        this.setState({ displayBugDetails: !this.state.displayBugDetails });
    }

    render() {
        const { id, summary } = this.props.data;
        const { tree, from, to, ISOfrom, ISOto } = this.props;
        console.log(ISOfrom, ISOto);
        const bugzillaBugUrl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
        return (
            <div onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
                <span className="text-primary">{id}</span><span className={`ml-1 small-text ${this.state.displayBugDetails ? "" : "hidden"}`}>
                    <Link to={{ pathname: "/bugdetailsview", search: `?startday=${ISOfrom}&endday=${ISOto}&tree=${tree}&bug=${id}`,
                          state: { tree, from, to, bugId: id, summary } }}
                    >details</Link>
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

export default connect(mapStateToProps, null)(BugColumn);
