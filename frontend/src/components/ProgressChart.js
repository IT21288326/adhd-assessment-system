import React, { useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";

const ProgressChart = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#28a745", "#ffc107"],
        hoverBackgroundColor: ["#28a745", "#ffc107"],
      },
    ],
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the chart instance when the component unmounts
      }
    };
  }, []);

  return <Doughnut data={data} ref={chartRef}/>;
};

export default ProgressChart;
