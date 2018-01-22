import * as d3 from 'd3';

// make sure to pass the data as a prop to the graph & reset the data key/value to that data prop
export const graphOneSpecs = {
    title: "Orange Count per Push",
    data: [],
    width: 700,
    height: 300,
    right: 40,
    interpolate: d3.curveLinear,
    color: "#dd6602",
    target: "graphic",
    x_accessor: "date",
    y_accessor: "value"
};

export const graphTwoSpecs = {
    data: [],
    width: 700,
    height: 300,
    right: 40,
    interpolate: d3.curveLinear,
    color: ["blue", "green"],
    target: "graphic",
    x_accessor: "date",
    y_accessor: "value",
    legend: ["Orange Count", "Push Count"],
    legend_target: '.legend'
};

// graph test data
export const oranges = {
    "2017-12-28": {
       orangecount: 157,
       testruns: 5,
    },
    "2017-12-27": {
       orangecount: 142,
       testruns: 5,
    },
    "2017-12-26": {
       orangecount: 89,
       testruns: 4,
    },
    "2017-12-25": {
       orangecount: 58,
       testruns: 2,
    },
    "2017-12-24": {
       orangecount: 193,
       testruns: 6,
    },
    "2017-12-23": {
       orangecount: 191,
       testruns: 7,
    },
    "2017-12-22": {
       orangecount: 132,
       testruns: 5,
    },
    "2017-12-21": {
       orangecount: 222,
       testruns: 6,
    }
};

export const treeherderUrl = "https://treeherder.mozilla.org/";
