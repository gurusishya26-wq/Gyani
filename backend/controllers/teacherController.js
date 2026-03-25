import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";

export const signupTeacher = async (req, res) => {

  try {

    const { name, email, password, subjects, qualification, experience } = req.body;

    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      subjects,
      qualification,
      experience
    });

    await teacher.save();

    res.status(201).json({ message: "Teacher account created" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};