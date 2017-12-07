'use strict';
const PropTypes = require('prop-types');

const NavButton = props => (
    <button className={props.class}
            title={props.title}
            onClick={props.buttonOnclick}>
            {props.text}</button>
);


class AutoClassifyToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.buttonOnclick = this.buttonOnclick.bind(this);
    }
    buttonOnclick(event) {
        event.preventDefault();
        console.log("boo");
        this.props.onPin();
    };

    render() {

        let statusText = null;
        if (this.props.status === 'ready' && this.props.autoClassifyStatus === "cross_referenced") {
            statusText = "Autoclassification pending";
        } else if (this.props.status === 'ready' && this.props.autoClassifyStatus === "failed") {
            statusText = "Autoclassification failed";
        }
        console.log("onPin " + this.props.onPin);
        return (
            <div className="navbar-right">
                {statusText &&
                    <span>{statusText}</span>}

                <NavButton
                        class="btn btn-view-nav btn-sm nav-menu-btn"
                        title="Pin job for bustage"
                        buttonOnclick={this.buttonOnclick}
                        text="Bustage" />
            </div>
        );
    }
};


class AutoClassificationPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("autoclassifystatus " + this.props.autoClassifyStatus);
        return (
            <div>
                <AutoClassifyToolbar
                                onPin={this.props.onPin} autoClassifyStatus={this.props.autoClassifyStatus}
                                status={this.props.status} />
            </div>
        );
    };
}

AutoClassificationPanel.PropTypes = {
    $injector: PropTypes.object,
    onPin: PropTypes.func,
    autoClassifyStatus: PropTypes.string,
    status: PropTypes.string
};

module.exports = {
    AutoClassificationPanel,
    AutoClassifyToolbar,
    NavButton
};

treeherder.directive('autoClassificationPanel', ['reactDirective', '$injector', (reactDirective, $injector) =>
reactDirective(AutoClassificationPanel, undefined, {}, { $injector })]);
