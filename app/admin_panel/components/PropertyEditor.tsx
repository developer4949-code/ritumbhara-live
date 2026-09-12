"use client";

import React, { useState } from "react";

export default function PropertyEditor({ property, onSave, onCancel }: { property: any, onSave: (p: any) => Promise<void>, onCancel: () => void }) {
  const [formData, setFormData] = useState(property);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amenities = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev: any) => ({ ...prev, amenities }));
  };

  const generateSEO = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setFormData((prev: any) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate SEO");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // TODO: Replace with real Cloudinary cloud_name and upload_preset
    const cloudName = "your_cloud_name";
    const uploadPreset = "your_upload_preset";

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev: any) => ({ ...prev, heroImage: data.secure_url }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image. Make sure Cloudinary is configured.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#EDE7DD] p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{formData.name || "New Property"}</h2>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium" disabled={isSaving}>Cancel</button>
          <button 
            onClick={handleSaveClick} 
            disabled={isSaving}
            className="bg-[#1A1A1A] text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSaving ? "Pushing..." : "Select & Push"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="font-semibold text-lg border-b pb-2">Core Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <input name="name" value={formData.name || ""} onChange={handleChange} className="w-full border rounded-md p-2 focus:ring-[#97183C] focus:border-[#97183C]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input name="slug" value={formData.slug || ""} onChange={handleChange} className="w-full border rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select name="destinationSlug" value={formData.destinationSlug || "jaipur"} onChange={handleChange} className="w-full border rounded-md p-2">
                <option value="jaipur">Jaipur</option>
                <option value="alwar">Alwar</option>
                <option value="sariska">Sariska</option>
                <option value="agra">Agra</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={3} className="w-full border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
            <input value={formData.amenities?.join(", ") || ""} onChange={handleAmenitiesChange} className="w-full border rounded-md p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
            <div className="flex gap-4 items-center">
              <input type="file" onChange={handleImageUpload} className="text-sm" accept="image/*" />
              {isUploading && <span className="text-sm text-blue-500">Uploading to Cloudinary...</span>}
            </div>
            {formData.heroImage && (
              <img src={formData.heroImage} alt="Hero preview" className="mt-3 rounded-lg w-full h-32 object-cover" />
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-semibold text-lg">AI SEO Engine</h3>
            <button 
              onClick={generateSEO}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-[#F5F1EA] text-[#97183C] px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-[#EDE7DD] transition-colors"
            >
              {isGenerating ? "Generating..." : "✨ Upgrade SEO"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input name="metaTitle" value={formData.metaTitle || ""} onChange={handleChange} className="w-full border rounded-md p-2 bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">Ideal length: 50-60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea name="metaDescription" value={formData.metaDescription || ""} onChange={handleChange} rows={3} className="w-full border rounded-md p-2 bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">Ideal length: 150-160 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">H1 Tag</label>
            <input name="h1" value={formData.h1 || ""} onChange={handleChange} className="w-full border rounded-md p-2 bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Generated FAQ Schema</label>
            <textarea 
              readOnly 
              value={formData.faqSchema ? JSON.stringify(formData.faqSchema, null, 2) : ""} 
              rows={4} 
              className="w-full border rounded-md p-2 bg-gray-100 font-mono text-xs text-gray-600" 
              placeholder="Click 'Upgrade SEO' to generate rich schema markup"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
