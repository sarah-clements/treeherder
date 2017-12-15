import moment from "moment";
import { formatDates } from "../helpers";

const getInitialDates = (today) => {
    const [ISOto, to] = formatDates(today);
    const [ISOfrom, from] = formatDates(today.subtract(7, "days"));
    return { from, to, ISOfrom, ISOto };
};

export const fetchData = (name = "") => (state = { data: {}, failureMessage: "" }, action) => {
    switch (action.type) {
        // case "REQUEST_BUGS_DATA":
        //     return {
        //         ...state,
        //         spinner: true,
        //     }
        case `FETCH_${name}_SUCCESS`:
            return {
                ...state,
                data: action.data,
            };
        case `FETCH_${name}_FAILURE`:
            return {
                ...state,
                message: action.failureMessage,
            };
    default:
            return state;
    }
};

export const updateDates = (name = "") => (state = getInitialDates(moment()), action) => {
    switch (action.type) {
        case `UPDATE_${name}_DATE_RANGE`:
            return {
                ...state,
                from: action.from,
                to: action.to
            };
    default:
            return state;
    }
};

export const updateTree = (name = "") => (state = { tree: "trunk" }, action) => {
    switch (action.type) {
        case `UPDATE_${name}_VIEW_TREE`:
            return {
                ...state,
                tree: action.tree
            };
    default:
            return state;
    }
};

