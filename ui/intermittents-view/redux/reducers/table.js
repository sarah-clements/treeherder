import moment from 'moment';
import { formatDates } from '../../constants';

const getInitialDates = (today) => {
    const [ISOto, to] = formatDates(today, null);
    const [ISOfrom, from] = formatDates(today.subtract(7, 'days'), moment().subtract(7, 'days'));
    return { from, to, ISOfrom, ISOto };
};
export const fetchData = (dataName = '') => (state = { data: {}, failureMessage: '' }, action) => {
    switch (action.type) {
        // case 'REQUEST_BUGS_DATA':
        //     return {
        //         ...state,
        //         spinner: true,
        //     }
        case `FETCH_${dataName}_SUCCESS`:
            return {
                ...state,
                data: action.data,
            };
        case `FETCH_${dataName}_FAILURE`:
            return {
                ...state,
                message: action.failureMssage,
            };
    default:
            return state;
    };
};

export const updateDates = (state = getInitialDates(moment()), action) => {
    switch (action.type) {
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
