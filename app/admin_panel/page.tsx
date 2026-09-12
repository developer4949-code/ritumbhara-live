"use client";

import React, { useState, useEffect } from "react";
import PropertyEditor from "./components/PropertyEditor";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load properties", err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (updatedProperty: any) => {
    const isNew = !properties.find((p) => p.slug === updatedProperty.slug);
    const newProperties = isNew 
      ? [...properties, updatedProperty] 
      : properties.map((p) => (p.slug === updatedProperty.slug ? updatedProperty : p));
    
    setProperties(newProperties);
    setSelectedProperty(null);

    await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProperties),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#EDE7DD] w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (username === "admin" && password === "ritumbhara@2026") {
              setIsAuthenticated(true);
            } else {
              alert("Invalid credentials");
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border rounded-md p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-md p-2" required />
            </div>
            <button type="submit" className="w-full bg-[#97183C] text-white font-medium py-2 rounded-md hover:bg-[#7A1330] transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2B2B2B] p-8 font-sans">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Sidebar */}
        <aside className="w-1/3 bg-white p-6 rounded-xl shadow-sm border border-[#EDE7DD]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Properties</h1>
            <button
              onClick={() => setSelectedProperty({})}
              className="bg-[#97183C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7A1330] transition-colors"
            >
              + New Property
            </button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>)}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {properties.map((p) => (
                <div
                  key={p.slug}
                  onClick={() => setSelectedProperty(p)}
                  className={`p-4 rounded-lg cursor-pointer border transition-all ${
                    selectedProperty?.slug === p.slug
                      ? "border-[#97183C] bg-[#97183C]/5"
                      : "border-gray-100 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-xs text-gray-500">{p.destinationSlug} • {p.propertyType}</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Editor Area */}
        <main className="w-2/3">
          {selectedProperty ? (
            <PropertyEditor 
              property={selectedProperty} 
              onSave={handleSave} 
              onCancel={() => setSelectedProperty(null)} 
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-[#EDE7DD] h-full flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="text-xl font-medium text-gray-900 mb-2">No Property Selected</h2>
              <p>Select a property from the sidebar to edit its details and generate AI SEO tags, or create a new one.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
