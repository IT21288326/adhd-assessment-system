// src/component/it21288326/ui/tabs.jsx
import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div {...props} />
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return <div className={`flex border-b ${className || ''}`} {...props} />;
}

export function TabsTrigger({ value, className, ...props }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} ${className || ''}`}
      onClick={() => setActiveTab(value)}
      {...props}
    />
  );
}

export function TabsContent({ value, className, ...props }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return <div className={className || ''} {...props} />;
}