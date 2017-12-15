
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

export const fetchBugData = url => dispatch => (
    fetch(url).then(response => response.json())
    .then(json => dispatch(fetchBugDataSuccess(json)))
    .catch((error) => {
        console.log("fetchBugData failed: " + error.failureMessage);
        dispatch(fetchBugDataFailure());
    })
);
