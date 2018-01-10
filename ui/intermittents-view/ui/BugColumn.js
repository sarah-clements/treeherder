import React from 'react';
import { Link } from 'react-router-dom';

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
        const { dataId } = this.props;
        const bugzillaBugUrl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
        return (
            <div onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
                <span className="text-primary">{dataId}</span><span className={`ml-1 small-text ${this.state.displayBugDetails ? "" : "hidden"}`}>
                    <Link to="/bugdetailsview">details</Link>
                    <a className="ml-1" target="_blank" href={bugzillaBugUrl + dataId}>bugzilla</a>
                </span>
            </div>
        );
    }
};

export default BugColumn;
