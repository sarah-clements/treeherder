'use strict';

// const JobDetailsListItem = props => (
//     <li className="small">
//         <label>{props.label}</label>
//         {props.labelHref &&
//         <a title={props.labelTitle}
//             href={props.labelHref}
//             onClick={props.labelOnclick}
//             target={props.labelTarget}>
//             {props.labelText} <span className="fa fa-pencil-square-o icon-superscript"></span>: </a>}
//         {!props.href ? <span className="ml-1">{props.text}</span> :
//         <a title={props.title}
//             className="ml-1"
//             href={props.href}
//             onClick={props.onclick}
//             target={props.target}>
//             {props.text}</a>}
//         {props.iconClass && <span className={`ml-1${props.iconClass}`}></span>}
//     </li>
// );


class JobTabsContent extends React.Component {
    constructor(props) {
        super(props);

        this.filterTextEvent = this.filterTextEvent.bind(this);
    }

    filterTextEvent(event, input) {
        event.preventDefault();
        this.props.filterByJobSearchStr(input);
    };

    render() {
        return <ul className="list-unstyled">
        <li>Test</li>
        {/* {this.props.jobDetails.map(data =>
            <JobDetailsListItem label={data.title ? data.title : 'Untitled Data'}
                key={data} />)}} */}
            {/* <li ng-repeat="line in job_details | orderBy:'title'" class="small">
            <label>{{line.title ? line.title : 'Untitled data'}}:</label>
            <!-- URL provided -->
            <a ng-if="line.url" title="{{line.title ? line.title : line.value}}" href="{{line.url}}" target="_blank">{{line.value}}</a>
            <span ng-if="line.url && line.value.endsWith('raw.log')">
                - <a title="{{line.value}}" href="https://mozilla.github.io/wptview/#/?urls={{line.url | encodeURIComponent}},{{job_details[buildernameIndex].value | encodeURIComponent}}">open in test results viewer</a>
            </span>
            <!-- no URL (just informational) -->
            <span ng-if="!line.url" ng-bind-html="line.value"></span>
            </li> */}
        </ul>;
    }
}

JobTabsContent.propTypes = {
    jobDetails: React.PropTypes.array,
};

module.exports = {
    JobTabsContent
};

treeherder.directive('jobTabsContent', ['reactDirective', '$injector', (reactDirective, $injector) =>
reactDirective(JobTabsContent, undefined, {}, { $injector })]);

