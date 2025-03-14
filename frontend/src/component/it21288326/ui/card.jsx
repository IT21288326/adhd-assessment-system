// src/component/it21288326/ui/card.jsx
import React from 'react';

export function Card({ className, ...props }) {
  return <div className={`bg-white shadow-md rounded-lg ${className || ''}`} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={`p-4 pb-0 ${className || ''}`} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={`text-lg font-semibold ${className || ''}`} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={`text-sm text-gray-500 ${className || ''}`} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={`p-4 pt-2 ${className || ''}`} {...props} />;
}