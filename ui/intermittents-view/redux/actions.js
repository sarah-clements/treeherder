
export const fetchBugData = (url, name) => dispatch => (
    fetch(url).then(response => response.json())
    .then((json) => {
        console.log("fetchBugData success");
        dispatch(fetchBugDataSuccess(json, name));
    })
    .catch((error) => {
        console.log("fetchBugData failed: " + error.failureMessage);
        dispatch(fetchBugDataFailure(name));
    })
);

//action creators
// export const requestBugData = () => ({
//     type: 'REQUEST_BUGS_DATA',
//     spinner: true
// });

export const fetchBugDataSuccess = (json, name) => ({
    type: `FETCH_${name}_SUCCESS`,
    data: json
});

export const fetchBugDataFailure = name => ({
    type: `FETCH_${name}_FAILURE`,
    failureMessage: 'Oops, there was a problem retrieving the data. Please try again later.'
});

export const updateDateRange = (from, to, name) => ({
    type: `UPDATE_${name}_DATE_RANGE`,
    from,
    to
});

export const updateTreeName = (tree, name) => ({
    type: `UPDATE_${name}_VIEW_TREE`,
    tree
});