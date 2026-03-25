import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {

  const [teacher, setTeacher] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bio, setBio] = useState("");

  const navigate = useNavigate();

  /* Logout */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  /* Select image */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (!e.target.files) return;

    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  /* Upload image */
  const uploadImage = async () => {
  if (!selectedImage) {
    alert("Please select an image first");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in");
    return;
  }

  console.log("Selected image:", selectedImage); // debug

  const formData = new FormData();
  formData.append("image", selectedImage);

  try {
    const res = await axios.post(
      `http://localhost:5000/api/teachers/upload-profile/${user.uid}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setTeacher(res.data);
    setBio(res.data.bio || "");
    alert("Profile image updated!");

  } catch (error: any) {
    console.error("Upload error:", error.response?.data || error.message);
    alert("Image upload failed");
  }
};

  /* Save teacher bio */
  const saveBio = async () => {

    const user = auth.currentUser;

    if (!user) return;

    try {

      const res = await axios.put(
        `http://localhost:5000/api/teachers/update-bio/${user.uid}`,
        { bio }
      );

      setTeacher(res.data);
      setBio(res.data.bio || "");

      alert("Bio updated successfully");

    } catch (error) {

      console.error(error);

    }

  };

  /* Fetch teacher data */
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) return;

      try {

        const res = await axios.get(
          `http://localhost:5000/api/teachers/${user.uid}`
        );

        setTeacher(res.data);
        setBio(res.data.bio || "");

      } catch (error) {

        console.error(error);

      }

    });

    return () => unsubscribe();

  }, []);

  if (!teacher) return <h3>Loading teacher data...</h3>;

  return (

    <div style={{ maxWidth: "600px", margin: "auto", fontFamily: "Arial" }}>

      <h2>Teacher Dashboard</h2>

      <button
        onClick={handleLogout}
        style={{
          float: "right",
          padding: "6px 12px",
          background: "#ff4d4d",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      <button
        onClick={() => navigate("/teacher/create-course")}
        style={{
          padding: "8px 14px",
          background: "#6f42c1",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginLeft: "10px"
        }}
      >
  Create Course
</button>

      <br /><br />

      {/* Profile Image */}
      <img
        src={
          preview ||
          teacher.profileImage ||
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
        }
        alt="Profile"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #ddd"
        }}
      />

      <br /><br />

      {/* Select image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <br /><br />

      {/* Upload button */}
      <button
        onClick={uploadImage}
        style={{
          padding: "8px 14px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        Upload Image
      </button>

      <hr style={{ margin: "25px 0" }} />

      <p><b>Name:</b> {teacher.name}</p>
      <p><b>Email:</b> {teacher.email}</p>
      <p><b>Mobile:</b> {teacher.mobile}</p>
      <p><b>Qualification:</b> {teacher.qualification}</p>
      <p><b>Experience:</b> {teacher.experience} years</p>

      <p>
        <b>Subjects:</b> {teacher.subjects.map((s: any) => s.name).join(", ")}
      </p>

      <hr style={{ margin: "25px 0" }} />

      <h3>Teacher Bio</h3>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Write about yourself..."
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          fontSize: "14px"
        }}
      />

      <br /><br />

      <button
        onClick={saveBio}
        style={{
          padding: "8px 14px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        Save Bio
      </button>

      <br /><br />

    </div>

  );

};

export default TeacherDashboard;