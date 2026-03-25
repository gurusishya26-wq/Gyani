import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TeacherSignup = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    qualification: "",
    experience: "",
    subjects: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Signup and save teacher profile
  const signupWithGoogle = async () => {

    try {

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const subjectsArray = form.subjects
        .split(",")
        .map(s => s.trim())
        .filter(s => s !== "");

      await axios.post("http://localhost:5000/api/teachers", {

        uid: user.uid,
        email: user.email,
        name: form.name || user.displayName,
        mobile: form.mobile,
        qualification: form.qualification,
        experience: Number(form.experience),
        subjects: subjectsArray

      });

      alert("Teacher account created");

      navigate("/teacher-dashboard");

    } catch (error) {

      console.error(error);
      alert("Signup failed");

    }

  };

  // Login only
  const loginWithGoogle = async () => {

    try {

      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      navigate("/teacher/dashboard");

    } catch (error) {

      console.error(error);
      alert("Login failed");

    }

  };

  return (

    <div style={{ width: "400px", margin: "auto" }}>

      <h2>Teacher Signup</h2>

      <input
        name="name"
        placeholder="Teacher Name"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="mobile"
        placeholder="Mobile Number"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="qualification"
        placeholder="Qualification"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="experience"
        placeholder="Experience (years)"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="subjects"
        placeholder="Subjects (comma separated)"
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={signupWithGoogle}>
        Signup With Google
      </button>

      <br /><br />

      <button onClick={loginWithGoogle}>
        Login With Google
      </button>

    </div>

  );

};

export default TeacherSignup;