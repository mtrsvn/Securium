import React, { useState, useEffect } from "react";

type PopupStep =
  | "setup"
  | "login"
  | "forgot"
  | "verifyOTP"
  | "resetPassword"
  | "unlocked";

const PASSWORD_KEY = "browser_extension_password";

const Popup: React.FC = () => {
  const [step, setStep] = useState<PopupStep>("login");
  const [password, setPassword] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirm, setSetupConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // On mount, check if password is set
  useEffect(() => {
    const stored = localStorage.getItem(PASSWORD_KEY);
    if (!stored) {
      setStep("setup");
    } else {
      setStep("login");
    }
  }, []);

  // Setup password for first time
  const handleSetupPassword = async () => {
    setLoading(true);
    setMessage("");
    if (!setupPassword || setupPassword.length < 4) {
      setMessage("Password must be at least 4 characters.");
      setLoading(false);
      return;
    }
    if (setupPassword !== setupConfirm) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }
    localStorage.setItem(PASSWORD_KEY, setupPassword);
    setMessage("");
    setStep("login");
    setSetupPassword("");
    setSetupConfirm("");
    setLoading(false);
  };

  // Login flow
  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    const stored = localStorage.getItem(PASSWORD_KEY);
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (password === stored) {
      setMessage("");
      setStep("unlocked");
      setPassword("");
    } else {
      setMessage("Incorrect password.");
    }
    setLoading(false);
  };

  // Forgot password: request OTP
  const handleRequestOTP = async () => {
    setLoading(true);
    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (email.length > 5 && email.includes("@")) {
      setStep("verifyOTP");
      setMessage("OTP sent to your email.");
    } else {
      setMessage("Invalid email address.");
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (otp === "0000") {
      setStep("resetPassword");
      setMessage("OTP verified. You can reset your password.");
    } else {
      setMessage("Incorrect OTP.");
    }
    setLoading(false);
  };

  // Reset password
  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (newPassword.length >= 4) {
      localStorage.setItem(PASSWORD_KEY, newPassword);
      setMessage("Password reset successful.");
      setStep("login");
      setPassword("");
      setEmail("");
      setOTP("");
      setNewPassword("");
    } else {
      setMessage("Password too short.");
    }
    setLoading(false);
  };

  const inputClass =
    "w-full border border-neutral-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-neutral-50 text-neutral-800 transition";
  const btnClass =
    "w-full bg-neutral-900 text-white py-2 rounded-lg hover:bg-neutral-800 transition font-medium disabled:opacity-50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 font-sans">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-6 border border-neutral-200">
        <h2 className="text-2xl font-bold mb-3 text-neutral-900 text-center tracking-tight font-sans select-none">
          Browser Lock Extension
        </h2>
        <p className="text-xs text-neutral-400 mb-4 text-center select-none">
          Secure your browser with a password
        </p>
        {step === "setup" && (
          <>
            <p className="text-neutral-700 text-sm mb-3 text-center select-none">
              Set your password to enable browser lock.
            </p>
            <input
              type="password"
              placeholder="New password"
              value={setupPassword}
              autoFocus
              onChange={(e) => setSetupPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={setupConfirm}
              onChange={(e) => setSetupConfirm(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handleSetupPassword}
              className={btnClass}
              disabled={loading || !setupPassword || !setupConfirm}
            >
              {loading ? "Setting up..." : "Set password"}
            </button>
          </>
        )}
        {step === "login" && (
          <>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handleLogin}
              className={btnClass}
              disabled={loading || !password}
            >
              {loading ? "Unlocking..." : "Unlock Browser"}
            </button>
            <button
              className="w-full text-xs text-neutral-500 underline text-center mt-2 hover:text-neutral-700"
              onClick={() => {
                setStep("forgot");
                setMessage("");
                setEmail("");
                setOTP("");
                setNewPassword("");
              }}
            >
              Forgot password?
            </button>
          </>
        )}
        {step === "forgot" && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handleRequestOTP}
              className={btnClass}
              disabled={loading || !email}
            >
              {loading ? "Requesting OTP..." : "Request OTP"}
            </button>
            <button
              className="w-full text-xs text-neutral-500 underline text-center mt-2 hover:text-neutral-700"
              onClick={() => setStep("login")}
            >
              Back to login
            </button>
          </>
        )}
        {step === "verifyOTP" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              autoFocus
              onChange={(e) => setOTP(e.target.value)}
              className={inputClass}
              maxLength={6}
            />
            <button
              onClick={handleVerifyOTP}
              className={btnClass}
              disabled={loading || !otp}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
        {step === "resetPassword" && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              autoFocus
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={handleResetPassword}
              className={btnClass}
              disabled={loading || !newPassword}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
        {step === "unlocked" && (
          <div className="text-center text-base font-semibold mb-2 text-green-700">
            Browser unlocked!
          </div>
        )}
        {message && (
          <div
            className={`text-center text-sm mt-4 ${
              message.toLowerCase().includes("success") ||
              message.toLowerCase().includes("verified")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;