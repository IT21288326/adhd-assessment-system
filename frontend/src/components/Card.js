import React from "react";

const Card = ({ title, items }) => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <h6 className="card-title text-primary">{title}</h6>
        <ul className="list-unstyled">
          {items.map((item, index) => (
            <li key={index}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Card;
