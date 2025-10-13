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
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-xs transition-all ${
                          nameFocused
                            ? "text-primary -translate-y-[50%]"
                            : "text-[#9f9e9e] -translate-y-[-55%]"
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
                      className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins text-xs transition-all ${
                        userName || nameFocused
                          ? "text-primary -translate-y-[50%]"
                          : "text-[#9f9e9e] -translate-y-[-55%]"
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
                      className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins text-xs transition-all ${
                        password || passwordFocused
                          ? "text-primary -translate-y-[50%]"
                          : "text-[#9f9e9e] -translate-y-[-55%]"
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
                  <p
                    onClick={() => setIsRegistering(true)}
                    className="text-[#00cb82] cursor-pointer font-Poppins text-xs sm:text-base"
                  >
                    New User Registration
                  </p>

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
