export const formatDates = (date, startday) => {
    const ISOdate = date.format("YYYY-MM-DD");
    if (startday) {
        date = startday;
    };
    const prettyDate = date.format("ddd MMM D, YYYY");

    return [ISOdate, prettyDate];
};

//TODO - replace path with treeherder url
export const apiUrlFormatter = (api, startday, endday, tree) => `http://localhost:3000/${api}?startday=${startday}&endday=${endday}&tree=${tree}`;
