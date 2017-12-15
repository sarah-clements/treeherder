const initialState = {
    bugs: {},
    failureMessage: ''
};

const bugsData = (state = initialState, action) => {
    switch (action.type) {
        // case 'REQUEST_BUGS_DATA':
        //     return {
        //         ...state,
        //         spinner: true,
        //     }
        case 'FETCH_BUGS_DATA_SUCCESS':
            return {
                ...state,
                bugs: action.bugs,
            };
        case 'FETCH_BUGS_DATA_FAILURE':
            return {
                ...state,
                message: action.failureMssage,
            };
    default:
            return state;
    };
};

export default bugsData;
