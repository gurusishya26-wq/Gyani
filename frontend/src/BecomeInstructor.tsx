import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  MessageCircle, 
  Star, 
  ChevronRight,
  Users,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";



const BecomeInstructor = () => {
  const navigate = useNavigate();
  
  // Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const benefits = [
    { icon: <PlayCircle className="w-8 h-8" />, title: "Create & Sell Courses", desc: "Upload videos, PDFs, quizzes and build professional courses effortlessly" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Earn Revenue", desc: "Keep up to 80% of your course revenue. Get paid monthly" },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Track Student Progress", desc: "Real-time analytics and detailed student performance insights" },
    { icon: <Globe className="w-8 h-8" />, title: "Reach Global Audience", desc: "Teach students from over 150 countries" },
    { icon: <MessageCircle className="w-8 h-8" />, title: "Live Classes & Interaction", desc: "Host live sessions and engage directly with your students" },
  ];

  const steps = [
    { number: "01", title: "Sign Up as Teacher", desc: "Create your instructor account in less than a minute" },
    { number: "02", title: "Complete Your Profile", desc: "Add your bio, expertise, photo and credentials" },
    { number: "03", title: "Create Your First Course", desc: "Upload videos, documents, quizzes and organize modules" },
    { number: "04", title: "Publish & Start Earning", desc: "Go live and earn from your knowledge" },
  ];

  const featuredTeachers = [
    { name: "Priya Sharma", role: "React & Next.js Expert", students: "12.4k", rating: 4.9, image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Rahul Verma", role: "Data Science & Python", students: "8.7k", rating: 4.8, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Ananya Gupta", role: "Digital Marketing Specialist", students: "15.2k", rating: 5.0, image: "https://randomuser.me/api/portraits/women/68.jpg" },
  ];

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    console.log("User:", user);

    // Optional: Send user data to backend
    /*
    await fetch("http://localhost:5000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      }),
    });
    */

    // Close modal
    setShowAuthModal(false);

  } catch (error) {
    console.error("Google Login Error:", error);
  }
};

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Teacher Login:" : "Teacher Register:", { email, password });
    // TODO: Add your actual login/register logic here
    setShowAuthModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#5faae0] to-[#4a9bd4] text-white py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Teach. Inspire. Earn.
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-90 mb-10">
            Join thousands of expert instructors sharing their knowledge and building successful careers on LearnHub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowAuthModal(true)}   // ← Opens Modal for Register
              className="bg-white text-[#5faae0] hover:bg-gray-100 px-10 py-4 rounded-2xl font-semibold text-lg transition active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              Start Teaching Now
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => { setIsLogin(true); setShowAuthModal(true); }}  // ← Opens Modal for Login
              className="border-2 border-white hover:bg-white/10 px-10 py-4 rounded-2xl font-semibold text-lg transition"
            >
              Login as Teacher
            </button>
          </div>

          
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Why Teachers Choose LearnHub</h2>
            <p className="text-gray-600 text-lg">Powerful tools to help you teach better and earn more</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-white border border-gray-100 p-8 rounded-3xl hover:shadow-xl hover:border-[#5faae0]/30 transition-all group">
                <div className="text-[#5faae0] mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center md:text-left">
                <div className="bg-[#5faae0] text-white w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto md:mx-0 mb-6 shadow-inner">
                  {step.number}
                </div>
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>

                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[55px] w-full h-0.5 bg-gray-200 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Instructors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTeachers.map((teacher, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition">
                <img 
                  src={teacher.image} 
                  alt={teacher.name} 
                  className="w-full h-64 object-cover" 
                />
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-900">{teacher.name}</h3>
                  <p className="text-[#5faae0] font-medium mb-4">{teacher.role}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-5 h-5 fill-current" /> {teacher.rating}
                    </div>
                    <div className="text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" /> {teacher.students}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Earn What You Deserve</h2>
          <p className="text-2xl text-gray-600 mb-10">
            Keep up to <span className="font-bold text-[#5faae0]">80%</span> of your course revenue
          </p>
          
          <div className="bg-white border rounded-3xl p-12 shadow-sm">
            <div className="text-6xl font-bold text-[#5faae0] mb-3">₹4,85,000+</div>
            <p className="text-gray-500 mb-8">Earned by our top instructors last month</p>
            
            <button 
              onClick={() => navigate('/teacher/onboard')}
              className="bg-[#5faae0] hover:bg-[#4a9bd4] text-white px-12 py-4 rounded-2xl font-semibold text-lg transition active:scale-95"
            >
              Start Earning Today
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-[#5faae0] to-[#4a9bd4] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold tracking-tighter mb-6">Ready to Share Your Knowledge?</h2>
          <p className="text-xl opacity-90 mb-10">Join LearnHub today and turn your expertise into income.</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-white text-[#5faae0] hover:bg-gray-100 px-14 py-5 rounded-3xl font-semibold text-xl transition active:scale-95 shadow-lg"
          >
            Become an Instructor Now
          </button>
        </div>
      </section>

      {/* ====================== TEACHER AUTH MODAL ====================== */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {isLogin ? "Welcome back, Teacher" : "Join as Instructor"}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  {isLogin 
                    ? "Sign in to manage your courses & students" 
                    : "Create your account and start teaching today"}
                </p>
              </div>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8">
              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 py-3.5 rounded-2xl font-medium transition mb-6"
              >
                <img 
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <div className="relative text-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-gray-500">or continue with email</span>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#5faae0]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-[#5faae0]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <a href="#" className="text-[#5faae0] hover:underline text-sm">Forgot password?</a>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#5faae0] hover:bg-[#4a9bd4] text-white py-4 rounded-2xl font-semibold text-lg transition active:scale-95"
                >
                  {isLogin ? "Login as Teacher" : "Create Instructor Account"}
                </button>
              </form>

              {/* Toggle Login / Register */}
              <p className="text-center mt-6 text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                  }}
                  className="text-[#5faae0] font-medium hover:underline"
                >
                  {isLogin ? "Register now" : "Login here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeInstructor;