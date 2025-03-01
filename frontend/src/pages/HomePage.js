import React from "react";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import ProgressChart from "../components/ProgressChart";
import AnalyticsChart from "../components/AnalyticsChart";

const HomePage = () => {
  const cardData = [
    {
      title: "Adhd Type",
      items: [
        { label: "Type", value: "Hyperactive" },
        { label: "Description", value: "Most common in children under 12" },
      ],
    },
    {
      title: "Quiz",
      items: [
        { label: "Name", value: "Attention Control Test" },
        { label: "Score", value: "85/100" },
      ],
    },
    {
      title: "Suggested Activity",
      items: [
        { label: "Activity", value: "Logic Puzzles" },
        { label: "Benefit", value: "Enhances problem-solving skills" },
      ],
    },
    {
      title: "Points",
      items: [
        { label: "Total Points", value: "1200" },
        { label: "Earned From", value: "Completed activities" },
      ],
    },
  ];
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>
        <div className="row">
        {cardData.map((item, index) => (
          <div className="col-md-3" key={index}>
            <Card title={item.title} items={item.items} />
          </div>
        ))}
      </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6>Goal Overview</h6>
                <ProgressChart />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6>Progress</h6>
                <AnalyticsChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
