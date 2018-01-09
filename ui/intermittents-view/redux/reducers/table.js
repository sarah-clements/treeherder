import moment from 'moment';
import { formatDates } from '../../constants';

// const initialState = {
//     bugs: {},
//     failureMessage: ''
// };

const getInitialState = (today) => {
    const [ISOto, to] = formatDates(today, null);
    const [ISOfrom, from] = formatDates(today.subtract(7, 'days'), moment().subtract(7, 'days'));
    return { from, to, ISOfrom, ISOto, bugs: {}, failureMessage: '' };
};

const bugsData = (state = getInitialState(moment()), action) => {
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
        case 'UPDATE_DATE_RANGE':
            return {
                ...state,
                from: action.from,
                to: action.to
            };
    default:
            return state;
    };
};

export default bugsData;
