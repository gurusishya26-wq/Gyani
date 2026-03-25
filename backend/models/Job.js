const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },          // Job Heading
    companyName: { type: String, required: true },      // Company / Org
    postName: { type: String, required: true },         // Post Name
    numberOfPosts: { type: Number, required: true },    // No of Posts
    advtNo: { type: String },                            // Advertisement No
    salary: { type: String },                            // Salary
    qualification: { type: String, required: true },   // Qualification
    ageLimit: { type: String },                          // Age Limit
    startDate: { type: Date, required: true },          // Start Date
    lastDateRegistration: { type: Date, required: true },
    lastDateApply: { type: Date, required: true },
    officialWebsite: { type: String },                  // Website URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
