// import { format } from 'moment';

//action creators
// export const requestBugData = () => ({
//     type: 'REQUEST_BUGS_DATA',
//     spinner: true
// });

export const fetchBugDataSuccess = json => ({
    type: 'FETCH_BUGS_DATA_SUCCESS',
    bugs: json
});

export const fetchBugDataFailure = () => ({
    type: 'FETCH_BUGS_DATA_FAILURE',
    failureMessage: 'Oops, there was a problem retrieving the data. Please try again later.'
});

export const updateDates = (from, to) => ({
    type: 'UPDATE_DATE_RANGE',
    from,
    to
});

export const fetchBugData = url => dispatch => (
    fetch(url).then(response => response.json())
    .then(json => dispatch(fetchBugDataSuccess(json)))
    .catch((error) => {
        console.log("fetchBugData failed: " + error.failureMessage);
        dispatch(fetchBugDataFailure());
    })
);

export const updateDateData = (startday, endday) => {
    const [ISOfrom, from] = formatDates(startday);
    const [ISOto, to] = formatDates(endday);
    console.log(ISOfrom + " " + from);
    console.log(ISOto + " " + to);
    // fetchBugData(queryUrl(ISOfrom, ISOto));
    // dispatch(updateDates(from, to));
};

const formatDates = (date) => {
    const ISOdate = date.format("YYYY-MM-DD");
    const prettyDate = date.format("ddd MMM D, YYYY");
    return [ISOdate, prettyDate];
};

// const queryUrl = (startday, endday) => `http://localhost:3000/bugs?startday=${startday}&endday=${endday}&tree=trunk`;
