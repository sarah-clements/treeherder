import moment from "moment";
import { bugzillaDomain } from "./constants";

//be sure to wrap date in a moment()
export const ISODate = date => date.format("YYYY-MM-DD");

export const prettyDate = date => moment(date).format("ddd MMM D, YYYY");

export const setDateRange = (day, numDays) => {
    const to = ISODate(day);
    const from = ISODate(day.subtract(numDays, "days"));
    console.log(from, to);
    return { from, to };
};

export const createApiUrl = (domain, endpoint, params) => {
    const query = createQueryParams(params);
    return `${domain}${endpoint}${query}`;
};

//bugs can be one bug or a comma separated (no spaces) string of bugs
export const bugzillaBugsApi = (endpoint, params) => {
    const query = createQueryParams(params);
   return `${bugzillaDomain}${endpoint}${query}`;
};

export const logviewerUrl = (tree, treeherderId) => `logviewer.html#?repo=${tree}&job_id=${treeherderId}`;

export const jobsUrl = (tree, revision) => `http://localhost:8000/#/jobs?repo=${tree}&revision=${revision}`;

export const parseQueryParams = (search) => {
    const params = new URLSearchParams(search);
    const from = params.get("startday");
    const to = params.get("endday");
    const bugId = params.get("bug");
    if (bugId) {
        return [from, to, params.get("tree"), bugId];
    }
    return [from, to, params.get("tree")];
};

export const createQueryParams = (params) => {
    let query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        query.set(key, value);
    }
    return `?${query.toString()}`;
};

export const formatBugsForBugzilla = (data) => {
    let bugs = '';
    for (let i = 0; i < data.length; i++) {
        bugs += `${data[i].bug_id},`;
    }
    return bugs;
};

export const mergeBugsData = (data, bugs) => {
    let dict = {};
    for (let i = 0; i < data.length; i++) {
        dict[data[i].bug_id] = data[i].bug_count;
    }

    for (let i = 0; i < bugs.length; i++) {
        let match = dict[bugs[i].id];
        if (match) {
            bugs[i].count = match;
        }
    }

    bugs.sort(function (a, b) {
        return b.count - a.count;
    });
    return bugs;
};

export const calculateMetrics = (data) => {
    let dateCounts = [];
    let dateTestRunCounts = [];
    let dateFreqs = [];
    let totalFailures = 0;
    let totalRuns = 0;

    for (let i = 0; i < data.length; i++) {
        let failures = data[i].failure_count;
        let testRuns = data[i].test_runs;
        let freq = testRuns < 1 || failures < 1 ? 0 : Math.round(failures/testRuns);
        // let freq = testRuns < 1 ? 0 : ().toFixed(2);
        // need to convert a date to Date object because metrics graphics only accepts JS Date objects
        let date = moment(data[i].date).toDate();

        totalFailures += failures;
        totalRuns += testRuns;
        dateCounts.push({ date, value: failures });
        dateTestRunCounts.push({ date, value: testRuns });
        dateFreqs.push({ date, value: freq });
    }
    return { graphOneData: dateFreqs, graphTwoData: [dateCounts, dateTestRunCounts], totalFailures, totalRuns };
};
