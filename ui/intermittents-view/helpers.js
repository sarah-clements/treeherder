import moment from "moment";
import { treeherderUrl } from "./constants";

export const formatDates = (date) => {
    const ISOdate = date.format("YYYY-MM-DD");
    const prettyDate = date.format("ddd MMM D, YYYY");
    return [ISOdate, prettyDate];
};

//TODO - replace localhost path with SERVICE_DOMAIN
export const apiUrlFormatter = (path, startDay, endDay, tree, bugId) => {
    let url = `http://localhost:8000/api/${path}/?startday=${startDay}&endday=${endDay}&tree=${tree}`;

    if (bugId) {
        url += `&bug=${bugId}`;
    }
    return url;
};

export const logviewerUrl = (tree, treeherderId) => `${treeherderUrl}logviewer.html#?repo=${tree}&job_id=${treeherderId}`;

export const jobsUrl = (tree, revision) => `${treeherderUrl}#/jobs?repo=${tree}&revision=${revision}`;

export const calculateMetrics = (data) => {
    let dateCounts = [];
    let dateTestRunCounts = [];
    let dateFreqs = [];
    let totalFailures = 0;
    let totalRuns = 0;

    for (var i = 0; i < data.length; i++) {
        let failures = data[i].failure_count;
        let testRuns = data[i].test_runs;
        let freq = testRuns < 1 ? 0 : Math.round(failures/testRuns);
        // let freq = testRuns < 1 ? 0 : (failures/testRuns).toFixed(2);
        // need to convert a date to Date object because metrics graphics only accepts JS Date objects
        let date = moment(data[i].date).toDate();

        totalFailures += failures;
        totalRuns += testRuns;
        dateCounts.push({ date, value: failures });
        dateTestRunCounts.push({ date, value: testRuns });
        dateFreqs.push({ date, value: freq });
    }
    console.log(dateFreqs);
    return { graphOneData: dateFreqs, graphTwoData: [dateCounts, dateTestRunCounts], totalFailures, totalRuns };
};

