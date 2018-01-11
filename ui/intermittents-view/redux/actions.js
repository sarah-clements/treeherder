// import { format } from 'moment';

//action creators
// export const requestBugData = () => ({
//     type: 'REQUEST_BUGS_DATA',
//     spinner: true
// });

export const fetchBugDataSuccess = (json, dataName) => ({
    type: `FETCH_${dataName}_SUCCESS`,
    data: json
});

export const fetchBugDataFailure = dataName => ({
    type: `FETCH_${dataName}_FAILURE`,
    failureMessage: 'Oops, there was a problem retrieving the data. Please try again later.'
});

export const updateDateRange = (from, to, stateName) => ({
    type: `UPDATE_${stateName}_DATE_RANGE`,
    from,
    to
});

export const fetchBugData = (url, dataName) => dispatch => (
    fetch(url).then(response => response.json())
    .then((json) => {
        console.log("fetchBugData success");
        dispatch(fetchBugDataSuccess(json, dataName));
    })
    .catch((error) => {
        console.log("fetchBugData failed: " + error.failureMessage);
        dispatch(fetchBugDataFailure(dataName));
    })
);
