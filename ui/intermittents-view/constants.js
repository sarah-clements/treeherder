export const formatDates = (date, startday) => {
    const ISOdate = date.format("YYYY-MM-DD");
    if (startday) {
        date = startday;
    };
    const prettyDate = date.format("ddd MMM D, YYYY");

    return [ISOdate, prettyDate];
};

//TODO - replace path with treeherder url
export const apiUrlFormatter = (api, startDay, endDay, tree, bugID) => {
    let url = `http://localhost:3000/${api}?startday=${startDay}&endday=${endDay}&tree=${tree}`;
    if (bugID) {
        return url + `&bugid=${bugID}`;
    }
    return url;
};
