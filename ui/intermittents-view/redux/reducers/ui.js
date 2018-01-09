
const initialState = {
    from: null,
    to: null,
    ISOfrom: null,
    ISOTo: null
};

const updateDates = (state = initialState, action) => {
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

export default updateDates;
