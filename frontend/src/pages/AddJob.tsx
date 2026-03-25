import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heading: "",
    companyName: "",
    postName: "",
    numberOfPosts: "",
    advtNo: "",
    salary: "",
    qualification: "",
    ageLimit: "",
    startDate: "",
    lastDateRegistration: "",
    lastDateApply: "",
    officialWebsite: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("https://gyani-vxc9.onrender.com/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          numberOfPosts: formData.numberOfPosts ? Number(formData.numberOfPosts) : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add job");
      }

      alert("Job added successfully!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error adding job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">Add New Job</h1>
            <p className="mt-2 text-indigo-100 opacity-90">
              Fill in the details to create a new job posting
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full width fields */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Heading <span className="text-red-500">*</span>
                </label>
                <input
                  name="heading"
                  placeholder="e.g. SSC CGL 2025 Recruitment"
                  value={formData.heading}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company / Organization <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName"
                  placeholder="e.g. Staff Selection Commission"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Post Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="postName"
                  placeholder="e.g. Assistant Audit Officer"
                  value={formData.postName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Posts
                </label>
                <input
                  name="numberOfPosts"
                  type="number"
                  placeholder="e.g. 125"
                  value={formData.numberOfPosts}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Advertisement No.
                </label>
                <input
                  name="advtNo"
                  placeholder="e.g. SSC CGL 01/2025"
                  value={formData.advtNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Salary / Pay Scale
                </label>
                <input
                  name="salary"
                  placeholder="e.g. ₹44,900 - ₹1,42,400 (Level-7)"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  name="qualification"
                  placeholder="e.g. Bachelor’s Degree from recognized university"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age Limit
                </label>
                <input
                  name="ageLimit"
                  placeholder="e.g. 18-32 years (as on 01/01/2025)"
                  value={formData.ageLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Date for Registration <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastDateRegistration"
                  type="date"
                  value={formData.lastDateRegistration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Date to Apply <span className="text-red-500">*</span>
                </label>
                <input
                  name="lastDateApply"
                  type="date"
                  value={formData.lastDateApply}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Official Website
                </label>
                <input
                  name="officialWebsite"
                  type="url"
                  placeholder="https://ssc.gov.in"
                  value={formData.officialWebsite}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full md:w-auto px-10 py-4 
                  bg-indigo-600 hover:bg-indigo-700 
                  text-white font-medium text-lg 
                  rounded-xl shadow-lg 
                  transition-all duration-200 
                  focus:outline-none focus:ring-4 focus:ring-indigo-300 
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-3
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
