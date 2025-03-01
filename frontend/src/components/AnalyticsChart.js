import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";

const AnalyticsChart = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ["01", "05", "09", "13", "17", "21", "26", "31"],
    datasets: [
      {
        label: "This Month",
        data: [45, 46, 47, 48, 47, 49, 50],
        borderColor: "#007bff",
        tension: 0.4,
      },
      {
        label: "Last Month",
        data: [44, 45, 46, 46, 45, 47, 48],
        borderColor: "#6c757d",
        tension: 0.4,
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

  return <Line data={data} ref={chartRef} />;
};

export default AnalyticsChart;
