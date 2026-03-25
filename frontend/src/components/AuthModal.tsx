// src/components/AuthModal.tsx
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { FaTimes, FaGoogle } from 'react-icons/fa';

import { auth } from '../firebase';

import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0); // 0 = Login, 1 = Register
  const [step, setStep] = useState<'google' | 'profile'>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: '',
    address: '',
    studentClass: '',
    dob: '',
    mobile: '',
  });

  const isLogin = activeTab === 0;

  // ─────────────────────────────────────────────
  // GOOGLE LOGIN
  // ─────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // GOOGLE REGISTER
  // ─────────────────────────────────────────────
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Pre-fill name
      setProfileData((prev) => ({
        ...prev,
        name: result.user.displayName || '',
      }));

      // Check if profile already exists
      const res = await fetch('/api/users/check-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: result.user.uid }),
      });

      const data = await res.json();

      if (data.exists) {
        onClose();
        navigate('/dashboard');
      } else {
        setStep('profile');
      }
    } catch (err: any) {
      setError(err.message || 'Google sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // COMPLETE PROFILE
  // ─────────────────────────────────────────────
  const handleCompleteRegistration = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;

      if (!user) {
        setError('User not authenticated');
        return;
      }

      await fetch('/api/users/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...profileData,
        }),
      });

      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl border border-gray-200 dark:border-gray-700">

                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-2xl font-bold">
                    {isLogin ? 'Login' : 'Create Account'}
                  </Dialog.Title>
                  <button onClick={onClose}>
                    <FaTimes size={22} />
                  </button>
                </div>

                {error && (
                  <div className="text-red-600 text-sm mb-4 text-center">
                    {error}
                  </div>
                )}

                <Tab.Group selectedIndex={activeTab} onChange={(i) => {
                  setActiveTab(i);
                  setStep('google');
                  setError(null);
                }}>
                  <Tab.List className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                    <Tab className="w-full py-2 rounded-lg font-medium ui-selected:bg-white ui-selected:shadow">
                      Login
                    </Tab>
                    <Tab className="w-full py-2 rounded-lg font-medium ui-selected:bg-white ui-selected:shadow">
                      Register
                    </Tab>
                  </Tab.List>

                  <Tab.Panels>

                    {/* LOGIN TAB */}
                    <Tab.Panel>
                      <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                      >
                        <FaGoogle />
                        {loading ? 'Signing in...' : 'Continue with Google'}
                      </button>
                    </Tab.Panel>

                    {/* REGISTER TAB */}
                    <Tab.Panel>
                      {step === 'google' ? (
                        <button
                          onClick={handleGoogleRegister}
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                        >
                          <FaGoogle />
                          {loading ? 'Signing up...' : 'Continue with Google'}
                        </button>
                      ) : (
                        <div className="space-y-4">

                          <input
                            type="text"
                            placeholder="Full Name"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({ ...profileData, name: e.target.value })
                            }
                            className="w-full px-4 py-3 border rounded-xl"
                          />

                          <input
                            type="text"
                            placeholder="Address"
                            value={profileData.address}
                            onChange={(e) =>
                              setProfileData({ ...profileData, address: e.target.value })
                            }
                            className="w-full px-4 py-3 border rounded-xl"
                          />

                          <input
                            type="text"
                            placeholder="Class"
                            value={profileData.studentClass}
                            onChange={(e) =>
                              setProfileData({ ...profileData, studentClass: e.target.value })
                            }
                            className="w-full px-4 py-3 border rounded-xl"
                          />

                          <input
                            type="date"
                            value={profileData.dob}
                            onChange={(e) =>
                              setProfileData({ ...profileData, dob: e.target.value })
                            }
                            className="w-full px-4 py-3 border rounded-xl"
                          />

                          <input
                            type="tel"
                            placeholder="Mobile (Optional)"
                            value={profileData.mobile}
                            onChange={(e) =>
                              setProfileData({ ...profileData, mobile: e.target.value })
                            }
                            className="w-full px-4 py-3 border rounded-xl"
                          />

                          <button
                            onClick={handleCompleteRegistration}
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold transition"
                          >
                            {loading ? 'Saving...' : 'Complete Registration'}
                          </button>

                        </div>
                      )}
                    </Tab.Panel>

                  </Tab.Panels>
                </Tab.Group>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}