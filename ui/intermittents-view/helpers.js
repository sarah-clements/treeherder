import moment from 'moment';
import { treeherderUrl } from './constants';

export const formatDates = (date) => {
    const ISOdate = date.format("YYYY-MM-DD");
    const prettyDate = date.format("ddd MMM D, YYYY");
    return [ISOdate, prettyDate];
};

//TODO - replace path with treeherder url *work-in-progress*
export const apiUrlFormatter = (api, startDay, endDay, tree, bugID) => {
    let url = `http://localhost:3000/${api}?startday=${startDay}&endday=${endDay}&tree=${tree}`;
    if (bugID) {
        return url + `&bugid=${bugID}`;
    }
    return url;
};

export const logviewerUrl = (tree, treeherderId) => `${treeherderUrl}logviewer.html#?repo=${tree}&job_id=${treeherderId}`;

export const jobsUrl = (tree, revision) => `${treeherderUrl}#/jobs?repo=${tree}&revision=${revision}`;

export const calculateMetrics = (data) => {
    let dateCounts = [];
    let dateTestRunCounts = [];
    let dateFreqs = [];
    let totalOranges = 0;
    let totalRuns = 0;

    Object.entries(data).map((orange) => {
        let count = orange[1].orangecount;
        let testruns = orange[1].testruns;
        let freq = testruns < 1 ? 0 : (count/testruns).toFixed(2);
        let date = moment(orange[0]).toDate();

        totalOranges += count;
        totalRuns += testruns;
        dateCounts.push({ date, value: count });
        dateTestRunCounts.push({ date, value: testruns });
        dateFreqs.push({ date, value: freq });
    });

    return { graphOneData: dateFreqs, graphTwoData: [dateCounts, dateTestRunCounts], totalOranges, totalRuns };
};

export const urlParams = (search) => {
    const params = new URLSearchParams(search);
    const startday = params.get("startday");
    const endday = params.get("endday");
    return [startday, endday, params.get("tree")];
};
