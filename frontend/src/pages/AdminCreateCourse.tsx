"use client";

import { useState } from "react";

export default function CourseBuilderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Create New Course</h1>

        {/* Section 1 */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">
            Course Information
          </h2>

          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Title
            </label>
            <input
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Description
            </label>
            <textarea
              placeholder="Write course description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save & Continue
          </button>
        </div>

      </div>
    </div>
  );
}