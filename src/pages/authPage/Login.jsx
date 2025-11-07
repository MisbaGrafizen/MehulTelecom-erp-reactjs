import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ApiPost } from "../../helper/axios"; // ✅ use ApiPost

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [newpasswordFocused, setNewpasswordFocused] = useState(false);
  const [confirmpasswordFocused, setConfirmpasswordFocused] = useState(false);
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [isOtpSent, setIsOtpSent] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isPasswordValid = password === confirmPassword && password.length >= 6;

  // ✅ handle mobile input (10 digits only)
  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) setMobileNumber(value);
  };

  // ✅ Register user and send OTP
  const handleGetOtp = async () => {
    setLoading(true);
    try {
      const registerResponse = await ApiPost("/spj/auth/user/register", {
        name: userName,
        email,
        mobileNumber,
      });
      console.log("Register Response:", registerResponse.data);

      const sendOtpResponse = await ApiPost("/spj/auth/send-otp", {
        mobileNumber,
      });
      console.log("Send OTP Response:", sendOtpResponse.data);

      alert("User registered and OTP sent successfully!");
    } catch (error) {
      console.error("Error during registration/OTP:", error);
      alert(error?.response?.data?.message || "Failed to register and send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const handleLogin = async () => {
    if (!userName || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      const response = await ApiPost("/auth/admin/login", {
        name: userName,
        password,
      });

      console.log("Login Success:", response.data);
      localStorage.setItem("token", response.data?.user?.tokens?.access?.token);
      localStorage.setItem("user", response.data?.user.user?.id);
      navigate("/stock-transfer");
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(
        error?.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  // ✅ Handle OTP input
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otpRefs.current.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      if (index > 0) otpRefs.current[index - 1]?.focus();
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (!mobileNumber || !otpValue) {
      alert("Mobile number and OTP are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await ApiPost("/spj/auth/verify-otp", {
        mobileNumber,
        otp: otpValue,
      });
      alert(response.data.message);
      setRegisterStep(2);
    } catch (error) {
      alert(error?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Set Password
  const handleSetPassword = async () => {
    if (!mobileNumber || !password || !confirmPassword) {
      alert("Mobile number, password, and confirm password are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await ApiPost("/spj/auth/set-password", {
        mobileNumber,
        password,
        confirmPassword,
      });
      alert(response.data.message);
      navigate("/create-account");
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // ---------------- UI ----------------
  return (
    <div className="sm:!bg-[#122f97] sm:py-11 select-none h-[100vh] sm:px-16 overflow-hidden">
      <div className="login-bg flex h-full gap-14 justify-center overflow-hidden">
        <div className="flex items-center justify-center relative font-medium text-sm md:min-w-[501px] max-w-[501px]">
          {isRegistering ? (
            <div className="bg-white w-full rounded-[7px] px-5 h-[580px] sm:p-[30px] shadow-main flex flex-col overflow-auto relative">
              <h1 className="text-3xl sm:text-[40px] font-[400] font-Poppins text-[#163151]">
                {registerStep === 1 ? "Register User" : "Create Password"}
              </h1>

              <form>
                {registerStep === 1 && (
                  <div
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                    className="mt-[40px] space-y-6"
                  >
                    {/* Username */}
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg">
                      <label
                        htmlFor="name"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary s transition-all ${
                          nameFocused
                            ? "text-primary text-xs -translate-y-[50%]"
                            : "text-[#9f9e9e] text-[20px] -translate-y-[-55%]"
                        }`}
                      >
                        User Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                        onFocus={() => setNameFocused(true)}
                        onBlur={(e) => setNameFocused(e.target.value !== "")}
                      />
                    </div>

                    {/* Email */}
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg">
                      <label
                        htmlFor="email"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-xs transition-all ${
                          emailFocused
                            ? "text-primary -translate-y-[50%]"
                            : "text-[#9f9e9e] -translate-y-[-55%]"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                        onFocus={() => setEmailFocused(true)}
                        onBlur={(e) => setEmailFocused(e.target.value !== "")}
                      />
                    </div>

                    {/* Mobile + Get OTP */}
                    <div className="flex gap-[10px]">
                      <div className="relative w-full border border-[#BCBCBC] py-4 px-1 rounded-lg flex items-center space-x-4">
                        <label
                          className={`bg-white px-1 absolute top-0 transform -translate-y-1/2 font-Poppins text-xs transition-all ${
                            mobileFocused
                              ? "text-primary -translate-y-[50%] left-[20px]"
                              : "text-[#9f9e9e] left-[50px] -translate-y-[-67%]"
                          }`}
                        >
                          Mobile Number
                        </label>
                        <p className="flex font-[400] text-[15px] font-Poppins">
                          +91
                        </p>
                        <input
                          type="text"
                          value={mobileNumber}
                          onChange={handleMobileChange}
                          className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                          onFocus={() => setMobileFocused(true)}
                          onBlur={(e) =>
                            setMobileFocused(e.target.value !== "")
                          }
                        />
                      </div>
                      <div
                        className={`flex w-[150px] justify-center items-center text-[18px] rounded-[8px] font-[500] font-Poppins ${
                          mobileNumber.length === 10
                            ? "bg-[#fff] text-primary border-primary active:bg-[#122f97] active:text-[#fff] border-[1.5px] cursor-pointer"
                            : "bg-[#fb0a0a] text-[#fff] cursor-not-allowed"
                        }`}
                        onClick={handleGetOtp}
                      >
                        <p>Get OTP</p>
                      </div>
                    </div>

                    {/* OTP Boxes */}
                    {isOtpSent && (
                      <div className="flex justify-between mt-6">
                        {otp.map((digit, index) => (
                          <div
                            key={index}
                            className="relative w-[60px] h-[60px] rounded-lg border-[1.5px] flex items-center justify-center"
                          >
                            <input
                              type="text"
                              value={digit}
                              ref={(el) => (otpRefs.current[index] = el)}
                              maxLength={1}
                              disabled={!isOtpSent}
                              onChange={(e) =>
                                handleOtpChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-12 h-12 text-center text-lg font-Poppins rounded outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-center w-[90%] bottom-[33px] absolute">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className={`w-full px-3 py-4 rounded-md font-Poppins text-white text-xl font-medium ${
                          isOtpComplete
                            ? "bg-[#122f97]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isOtpComplete}
                      >
                        Go Ahead
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div
                    onKeyDown={(e) => e.key === "Enter" && handleSetPassword()}
                    className="mt-14 space-y-8"
                  >
                    {/* New Password */}
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg">
                      <label
                        htmlFor="password"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins text-xs transition-all ${
                          newpasswordFocused
                            ? "text-primary -translate-y-[50%]"
                            : "text-[#9f9e9e] -translate-y-[-55%]"
                        }`}
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                        onFocus={() => setNewpasswordFocused(true)}
                        onBlur={(e) =>
                          setNewpasswordFocused(e.target.value !== "")
                        }
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4">
                      <label
                        htmlFor="confirmPassword"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins text-xs transition-all ${
                          confirmpasswordFocused
                            ? "text-primary -translate-y-[50%]"
                            : "text-[#9f9e9e] -translate-y-[-55%]"
                        }`}
                      >
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                        onFocus={() => setConfirmpasswordFocused(true)}
                        onBlur={(e) =>
                          setConfirmpasswordFocused(e.target.value !== "")
                        }
                      />
                      <i
                        className={`fa-solid ${
                          showPassword
                            ? "fa-eye text-[#122f97]"
                            : "fa-eye-slash"
                        } text-[19px] cursor-pointer`}
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>

                    <div className="text-center w-[90%] bottom-[33px] absolute">
                      <button
                        type="button"
                        onClick={handleSetPassword}
                        className="w-full px-3 py-4 rounded-md font-Poppins text-white bg-[#122f97] text-xl font-medium"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            // ------------- Login Page -------------
            <div className="bg-white w-full rounded-[7px] px-5 h-[580px] sm:p-8 shadow-main flex flex-col overflow-auto relative">
              <h1 className="text-3xl sm:text-[40px] font-[500] font-Poppins text-[#163151]">
                Log In
              </h1>

              <form onKeyDown={(e) => e.key === "Enter" && handleLogin()}>
                <div className="mt-14 space-y-8">
                  {/* Username */}
                  <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg">
                    <label
                      htmlFor="name"
                      className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins transition-all ${
                        userName || nameFocused
                          ? "text-primary text-xs  -translate-y-[50%]"
                          : "text-[#9f9e9e] text-[18px] font-[400] -translate-y-[-85%]"
                      }`}
                    >
                      User Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                      onFocus={() => setNameFocused(true)}
                      onBlur={(e) => setNameFocused(e.target.value !== "")}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4">
                    <label
                      htmlFor="password"
                      className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins  transition-all ${
                        password || passwordFocused
                          ? "text-primary text-xs  -translate-y-[50%]"
                          : "text-[#9f9e9e] text-[18px] font-[400] -translate-y-[-85%]"
                      }`}
                    >
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full outline-none text-[15px] font-Poppins bg-transparent"
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={(e) => setPasswordFocused(e.target.value !== "")}
                    />
                    <i
                      className={`fa-solid ${
                        showPassword
                          ? "fa-eye text-[#122f97]"
                          : "fa-eye-slash"
                      } text-[19px] cursor-pointer`}
                      onClick={togglePasswordVisibility}
                    ></i>
                  </div>
                </div>

                <div className="absolute w-[100%] bottom-[33px]">
                  {/* <p
                    onClick={() => setIsRegistering(true)}
                    className="text-[#00cb82] cursor-pointer font-Poppins text-xs sm:text-base"
                  >
                    New User Registration
                  </p> */}

                  <div className="text-center w-[87%] mt-3">
                    <button
                      onClick={handleLogin}
                      type="button"
                      className="w-full bg-[#122f97] px-3 py-4 rounded-md font-Poppins text-white text-xl font-medium"
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// import React from "react";

// export default function Login() {
//   const [showPassword, setShowPassword] = React.useState(false);

//   return (
//     <div className="min-h-screen  font-Oregano bg-slate-50 flex items-center justify-center p-6">
//       <div className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
//         <div className="grid md:grid-cols-2">
//           {/* Left — blue welcome side */}
//           <div className="relative isolate overflow-hidden text-white">
//             <div className="relative h-full min-h-[520px] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-10 md:p-12 lg:p-16">
//               {/* Decorative gradient spheres */}
//               <div className="pointer-events-none absolute inset-0">
//                 <div
//                   className="absolute -left-32 -top-40 h-[540px] w-[540px] rounded-full opacity-90"
//                   style={{
//                     background:
//                       "radial-gradient( circle at 30% 30%, #58c8ff 0%, #1e84ea 55%, #0f59c8 100%)",
//                   }}
//                 />
//                 <div
//                   className="absolute left-36 bottom-10 h-64 w-64 rounded-full opacity-95"
//                   style={{
//                     background:
//                       "radial-gradient( circle at 30% 30%, #58c8ff 0%, #1e84ea 60%, #0f59c8 100%)",
//                   }}
//                 />
//                 <div
//                   className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full opacity-80"
//                   style={{
//                     background:
//                       "radial-gradient( circle at 30% 30%, #3fb3ff 0%, #1a74da 60%, #0d49b5 100%)",
//                   }}
//                 />
//               </div>

//               {/* Copy */}
//               <div className="relative z-10 mt-10 md:mt-16">
//                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide">
//                   WELCOME
//                 </h1>
//                 <p className="mt-2 text-sm uppercase tracking-[0.35em] text-blue-100">
//                   Your Headline Name
//                 </p>
//                 <p className="mt-6 max-w-xl text-sm leading-relaxed text-blue-100/90">
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
//                   do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                   Enim ad minim veniam quis nostrud exercit.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right — sign in form */}
//           <div className="p-8 md:p-10 lg:p-12">
//             <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Lorem ipsum dolor sit amet, consectetur adipisicing elit
//             </p>

//             <form className="mt-8 space-y-4">
//               {/* Username */}
//               <label className="block">
//                 <span className="sr-only">User Name</span>
//                 <div className="flex h-12 items-center rounded-lg bg-slate-50/70 px-3 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-blue-500">
//                   <svg
//                     className="size-5 text-slate-400"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     <path d="M20 21a8 8 0 0 0-16 0" />
//                     <circle cx="12" cy="7" r="4" />
//                   </svg>
//                   <input
//                     type="text"
//                     placeholder="User Name"
//                     className="ml-3 w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none"
//                   />
//                 </div>
//               </label>

//               {/* Password */}
//               <label className="block">
//                 <span className="sr-only">Password</span>
//                 <div className="flex h-12 items-center rounded-lg bg-slate-50/70 px-3 ring-1 ring-slate-200 transition focus-within:ring-2 focus-within:ring-blue-500">
//                   <svg
//                     className="size-5 text-slate-400"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.6"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     <rect x="3" y="11" width="18" height="10" rx="2" />
//                     <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//                   </svg>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     className="ml-3 w-full bg-transparent text-slate-900 placeholder-slate-400 outline-none"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     className="ml-2 text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
//                   >
//                     {showPassword ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </label>

//               {/* Options row */}
//               <div className="flex items-center justify-between text-sm">
//                 <label className="inline-flex select-none items-center gap-2 text-slate-600">
//                   <input
//                     type="checkbox"
//                     className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                   />
//                   Remember me
//                 </label>
//                 <a
//                   href="#"
//                   className="font-medium text-blue-600 hover:text-blue-700"
//                 >
//                   Forgot Password?
//                 </a>
//               </div>

//               {/* Primary CTA */}
//               <button
//                 type="submit"
//                 className="h-12 w-full rounded-lg bg-blue-600 font-semibold text-white shadow-sm transition hover:bg-blue-700"
//               >
//                 Sign in
//               </button>

//               {/* Divider */}
//               {/* <div className="relative my-2 text-center">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-slate-200" />
//                 </div>
//                 <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400">
//                   Or
//                 </span>
//               </div> */}

//               {/* Secondary CTA */}
//               {/* <button
//                 type="button"
//                 className="h-12 w-full rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 transition hover:bg-slate-50"
//               >
//                 Sign in with other
//               </button> */}
//             </form>

//             {/* <p className="mt-8 text-center text-xs text-slate-500">
//               Don’t have an account?{" "}
//               <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
//                 Sign Up
//               </a>
//             </p> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }