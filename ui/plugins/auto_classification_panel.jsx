'use strict';
const PropTypes = require('prop-types');

const AutoclassifyToolbar = (props) => {
    let statusText = null;
    if (props.status === 'ready' && props.autoclassifyStatus === "cross_referenced") {
        statusText = "Autoclassification pending";
    } else if (props.status === 'ready' && props.autoclassifyStatus === "failed") {
        statusText = "Autoclassification failed";
    }
    return (
        <div className="navbar-right">
            {statusText &&
                <span>{statusText}</span>}

            <NavButton
                    class="btn btn-view-nav btn-sm nav-menu-btn"
                    title="Pin job for bustage"
                    onclick={props.ctrl.onPin}
                    text="Bustage" />
        </div>
    );
};

const NavButton = (props) => {
    const buttonOnclick = (event) => {
        event.preventDefault();
        props.onclick();
    };
    return (
        <button className={props.class}
                title={props.title}
                onClick={buttonOnclick}>
                {props.text}</button>
    );
};

class FailureClassificationPanel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <AutoclassifyToolbar
                                ctrl={this.props.ctrl} autoclassifyStatus={this.props.autoclassifyStatus}
                                status={this.props.status} />
            </div>
        );
    };
}

FailureClassificationPanel.PropTypes = {
    $injector: PropTypes.object,
    ctrl: PropTypes.object,
    autoclassifyStatus: PropTypes.string,
    status: PropTypes.string
};

module.exports = {
    FailureClassificationPanel,
    AutoclassifyToolbar,
    NavButton
};

treeherder.directive('failureClassificationPanel', ['reactDirective', '$injector', (reactDirective, $injector) =>
reactDirective(FailureClassificationPanel, undefined, {}, { $injector })]);
