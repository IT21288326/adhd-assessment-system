// src/component/it21288326/ui/progress.jsx
import React from 'react';

export function Progress({ value, className, ...props }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${className || ''}`} 
        style={{ width: `${value}%` }} 
        {...props}
      />
    </div>
  );
}