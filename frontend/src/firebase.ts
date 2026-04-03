import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_iB1kuly_hr4U_KhqgVcZys6_u7UVQVw",
  authDomain: "gyani-34029.firebaseapp.com",
  projectId: "gyani-34029",
  appId: "1:133735018223:web:0f836acba1bb15c30ef51a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();