import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

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
    };

    render() {
        const { bugId } = this.props;
        const bugzillaBugUrl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
        return (
            <div onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
                <span className="text-primary">{bugId}</span><span className={`ml-1 small-text ${this.state.displayBugDetails ? "" : "hidden"}`}>
                    <Link to={{ pathname: "/bugdetailsview", state: { bugId, from: this.props.from, to: this.props.to } }}>details</Link>
                    <a className="ml-1" target="_blank" href={bugzillaBugUrl + bugId}>bugzilla</a>
                </span>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    from: state.dates.from,
    to: state.dates.to,
});

export default connect(mapStateToProps, null)(BugColumn);