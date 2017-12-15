import * as d3 from "d3";

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
    legend_target: ".legend"
};
