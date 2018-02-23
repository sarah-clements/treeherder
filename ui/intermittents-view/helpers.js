import moment from "moment";
import { bugzillaUrl } from "./constants";

export const formatDates = (date) => {
    const ISOdate = date.format("YYYY-MM-DD");
    const prettyDate = date.format("ddd MMM D, YYYY");
    return [ISOdate, prettyDate];
};

//TODO - replace localhost path with SERVICE_DOMAIN
export const apiUrlFormatter = (path, startDay, endDay, tree, bugId, page, search) => {
    let url = `http://localhost:8000/api/${path}/?startday=${startDay}&endday=${endDay}&tree=${tree}`;

    if (bugId) {
        url += `&bug=${bugId}`;
    }

    if (page) {
        url += `&page=${page}`;
    }

    if (search) {
        url += `&search=${search}`;
    }

    return url;
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

//bugs can be one bug or a comma separated (no spaces) string of bugs
export const bugzillaBugsApi = bugs => `${bugzillaUrl}rest/bug?include_fields=id,status,summary,whiteboard&id=${bugs}`;

//TODO - replace localhost path with SERVICE_DOMAIN
export const logviewerUrl = (tree, treeherderId) => `logviewer.html#?repo=${tree}&job_id=${treeherderId}`;

export const jobsUrl = (tree, revision) => `http://localhost:8000/#/jobs?repo=${tree}&revision=${revision}`;

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

export const parseUrlParams = (search) => {
    const params = new URLSearchParams(search);
    const ISOfrom = params.get("startday");
    const ISOto = params.get("endday");
    const from = moment(ISOfrom).format("ddd MMM D, YYYY");
    const to = moment(ISOto).format("ddd MMM D, YYYY");
    const bugId = params.get("bug");
    if (bugId) {
        return [from, to, ISOfrom, ISOto, params.get("tree"), bugId];
    }
    return [from, to, ISOfrom, ISOto, params.get("tree")];
};

export const updateUrlParams = (ISOfrom, ISOto, tree, bugId) => {
    let params = new URLSearchParams();
    params.set("startday", ISOfrom);
    params.set("endday", ISOto);
    params.set("tree", tree);
    if (bugId) {
        params.set("bug", bugId);
    }
    return `?${params.toString()}`;
};
