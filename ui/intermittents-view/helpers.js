import moment from 'moment';

export const formatDates = (date, startday) => {
    const ISOdate = date.format("YYYY-MM-DD");
    if (startday) {
        date = startday;
    };
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