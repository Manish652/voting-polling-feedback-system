import React from "react";

export default function Background({ children }) {
  return (
    <div className="min-h-screen bg-base-200">
      {children}
    </div>
  );
}