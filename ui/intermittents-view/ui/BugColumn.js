import React from 'react';

class BugColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayBugDetails: false,
        };
        this.displayBugText = this.displayBugText.bind(this);
    }

    displayBugText = () => {
        this.setState({ displayBugDetails: !this.state.displayBugDetails });
    };

    render() {
        const { dataId } = this.props;
        const bugzillaBugUrl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
        return (
            <td onMouseEnter={this.displayBugText} onMouseLeave={this.displayBugText}>
                {dataId}<span className={`ml-1 small-text ${this.state.displayBugDetails ? "" : "hidden"}`}>
                    {/* <a target="_blank" href={bugzillaBugUrl + dataId}>details</a> */}
                    <a className="ml-1" target="_blank" href={bugzillaBugUrl + dataId}>bugzilla</a>
                </span>
            </td>
        );
    }
};

export default BugColumn;
