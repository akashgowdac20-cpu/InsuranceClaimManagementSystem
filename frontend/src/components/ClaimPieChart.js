import React from "react";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function ClaimPieChart({
    pending,
    approved,
    rejected
}) {

    const data = {

        labels: [
            "Pending",
            "Approved",
            "Rejected"
        ],

        datasets: [

            {
                label: "Claims",

                data: [
                    pending,
                    approved,
                    rejected
                ],

                backgroundColor: [
                    "#ffc107",
                    "#198754",
                    "#dc3545"
                ],

                borderColor: [
                    "#ffc107",
                    "#198754",
                    "#dc3545"
                ],

                borderWidth: 1
            }

        ]

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                position: "bottom"

            }

        }

    };

    return (

        <Pie
            data={data}
            options={options}
        />

    );

}

export default ClaimPieChart;