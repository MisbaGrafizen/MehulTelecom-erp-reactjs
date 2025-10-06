import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isPasswordValid = password === confirmPassword && password.length >= 6;

  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  const otpRefs = useRef([]);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
    }
  };

  const handleGetOtp = async () => {
    setLoading(true);
    try {
      const registerResponse = await axios.post(
        "https://server.grafizen.in/api/v2/spj/auth/user/register",
        {
          name: userName,
          email,
          mobileNumber,
        }
      );
      console.log("Register Response:", registerResponse.data);

      // Step 2: Send OTP
      const sendOtpResponse = await axios.post(
        "https://server.grafizen.in/api/v2/spj/auth/send-otp",
        {
          mobileNumber,
        }
      );
      console.log("Send OTP Response:", sendOtpResponse.data);

      alert("User registered and OTP sent successfully!");
      alert("User registered and OTP sent successfully!");
    } catch (error) {
      console.error(
        "Error during registration and OTP:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message || "Failed to register and send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!userName || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }
    try {
      const response = await axios.post(
        "https://server.grafizen.in/api/v2/spj/auth/user/login",
        {
          name: userName,
          password: password,
        }
      );
      console.log("Login Success:", response.data);
      Cookies.set("token", response.data.token);
      Cookies.set("user", response.data.user._id);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data?.message || error.message
      );
      setErrorMessage("Invalid credentials. Please try again.");
    }
  };

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

      if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (!mobileNumber || !otpValue) {
      alert("Mobile number and OTP are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://server.grafizen.in/api/v2/spj/auth/verify-otp",
        {
          mobileNumber,
          otp: otpValue,
        }
      );
      alert(response.data.message);
      setRegisterStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

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
      const response = await axios.post(
        "https://server.grafizen.in/api/v2/spj/auth/set-password",
        {
          mobileNumber,
          password,
          confirmPassword,
        }
      );
      alert(response.data.message);
      navigate("/create-account");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className=" sm:!bg-[#122f97] sm:py-11 select-none h-[100vh] sm:px-16 overflow-hidden">
      <div className="login-bg flex h-full gap-14 overflow-hidden justify-center">
        <div className="flex items-center justify-center  relative font-medium text-sm md:min-w-[501px] max-w-[501px]">
          {isRegistering ? (
            <div className="bg-white w-full rounded-[7px]  relative   px-5 h-[580px] sm:p-[30px] shadow-main flex flex-col overflow-auto">
              <div className="space-y-">
                <h1 className="text-3xl sm:text-[40px] font-[400] font-Poppins text-[#163151]">
                  {registerStep === 1 ? "Register User" : "Create Password"}
                </h1>
              </div>

              <form>
                {registerStep === 1 && (
                  <div onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()} className="mt-[40px] space-y-6">
                    {/* Name Input */}
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="name"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                          nameFocused
                            ? "-translate-y-[50%] text-primary text-xs"
                            : "  -translate-y-[-55%] cursor-text  text-[#9f9e9e] text-xs"
                        }`}
                      >
                        User Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={nameFocused ? "" : ""}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                        onFocus={() => setNameFocused(true)}
                        onBlur={(e) => setNameFocused(e.target.value !== "")}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="email"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                          emailFocused
                            ? "-translate-y-[50%] text-primary text-xs"
                            : "  -translate-y-[-55%] cursor-text  text-[#9f9e9e] text-xs"
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={emailFocused ? "" : ""}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                        onFocus={() => setEmailFocused(true)}
                        onBlur={(e) => setEmailFocused(e.target.value !== "")}
                      />
                    </div>

                    {/* Mobile Number Input */}
                    <div className="flex gap-[10px]">
                      <div className="relative w-full border border-[#BCBCBC] py-4 px-1 rounded-lg flex items-center space-x-4 text-[#00000099]">
                        <label
                          htmlFor="number"
                          className={`bg-white px-1 absolute top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                            mobileFocused
                              ? "-translate-y-[50%] left-[20px] text-primary text-xs"
                              : " -translate-y-[-67%] cursor-text left-[50px] text-[#9f9e9e] text-xs"
                          }`}
                        >
                          Mobile Number
                        </label>
                        <p className=" flex font-[400] text-[15px] font-Poppins">
                          +91
                        </p>
                        <input
                          type="text"
                          name="number"
                          id="number"
                          value={mobileNumber}
                          placeholder={mobileFocused ? "" : ""}
                          className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                          onFocus={() => setMobileFocused(true)}
                          onBlur={(e) =>
                            setMobileFocused(e.target.value !== "")
                          }
                          onChange={handleMobileChange}
                        />
                      </div>
                      <div
                        className={`flex w-[150px] justify-center items-center text-[18px] rounded-[8px] font-[500] font-Poppins ${
                          mobileNumber.length === 10
                            ? "bg-[#fff] text-primary border-primary select-none active:bg-[#122f97] active:text-[#fff]  active:border-[0px] border-[1.5px] cursor-pointer"
                            : "bg-[#fb0a0a] text-[#fff] cursor-not-allowed"
                        }`}
                        onClick={handleGetOtp}
                      >
                        <p>Get OTP</p>
                      </div>
                    </div>

                    {isOtpSent && (
                      <div className="flex justify-between mt-6">
                        {otp.map((digit, index) => (
                          <div
                            key={index}
                            className={`relative w-[60px] h-[60px] rounded-lg flex items-center justify-center ${
                              isOtpSent ? "" : "border-gray-300"
                            } border-[1.5px]`}
                          >
                            <input
                              key={index}
                              type="text"
                              value={digit}
                              ref={(el) => (otpRefs.current[index] = el)}
                              maxLength={1}
                              disabled={!isOtpSent} // Disable until OTP is sent
                              onChange={(e) =>
                                handleOtpChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className={`w-12 h-12 text-center text-lg  font-Poppins rounded  outline-none 
                              
                              `}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-center  w-[90%] bottom-[33px] absolute  ">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className={`w-full px-3 py-4 rounded-md font-Poppins text-white text-xl font-medium ${
                          (registerStep === 1 && isOtpComplete) ||
                          (registerStep === 2 && isPasswordValid)
                            ? "bg-[#122f97] shadow-blue"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={
                          (registerStep === 1 && !isOtpComplete) ||
                          (registerStep === 2 && !isPasswordValid)
                        }
                      >
                        {registerStep === 1 ? "Go Ahead" : "Register Now"}
                      </button>
                      <p className="text-sm sm:text-[13px]    font-Poppins w-[90%] !text-[#00000099] mt-[5px]  font-[300] mx-auto  lg:mt-[10px]">
                        By Logging in, I agree with all
                        <a
                          href="https://billwale.com/privacypolicy?navigate=policy"
                          target="_blank"
                          className=" pl-[5px] pr-[5px] text-[#F7941D]"
                          rel="noreferrer"
                        >
                          Privacy Policy
                        </a>
                        and
                        <a
                          href="https://billwale.com/privacypolicy?navigate=terms"
                          target="_blank"
                          className="text-[#F7941D] pl-[5px]"
                          rel="noreferrer"
                        >
                          Terms of Service
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {registerStep === 2 && (
                  <div onKeyDown={(e) => e.key === "Enter" && handleSetPassword()} className="mt-14 space-y-8">
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="password"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                          newpasswordFocused
                            ? "-translate-y-[50%] text-primary text-xs"
                            : "  -translate-y-[-55%] cursor-text  text-[#9f9e9e] text-xs"
                        }`}
                      >
                        New Password
                      </label>

                      <input
                        type="text"
                        name="password"
                        id="password"
                        value={password}
                        placeholder={newpasswordFocused ? "" : ""}
                        className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                        onFocus={() => setNewpasswordFocused(true)}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) =>
                          setNewpasswordFocused(e.target.value !== "")
                        }
                      />
                    </div>
                    <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4 text-[#00000099]">
                      <label
                        htmlFor="confirmPassword"
                        className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                          confirmpasswordFocused
                            ? "-translate-y-[50%] text-primary text-xs"
                            : "  -translate-y-[-55%] cursor-text  text-[#9f9e9e] text-xs"
                        }`}
                      >
                        Confirmed password
                      </label>

                      <input
                                     type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={confirmpasswordFocused ? "" : ""}
                        className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                        onFocus={() => setConfirmpasswordFocused(true)}
                        onBlur={(e) =>
                          setConfirmpasswordFocused(e.target.value !== "")
                        }
                      />
                        <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye text-[#122f97]" : "fa-eye-slash"
                      } text-[19px]  cursor-pointer`}
                      onClick={togglePasswordVisibility}
                    ></i>
                    </div>
                    <div className="text-center  w-[90%] bottom-[33px] absolute  ">
                      <button
                        type="button"
                        onClick={handleSetPassword}
                        className={`w-full px-3 py-4 rounded-md font-Poppins text-white bg-[#122f97] shadow-blue text-xl font-medium `}
                      >
                        Register Now
                      </button>
                      <p className="text-sm sm:text-[12px]  pl-[4px]  font-Poppins w-[90%] text-[#00000099]  mx-auto font-light mt-auto lg:mt-[10px]">
                        By Logging in, I agree with all
                        <a
                          href="https://billwale.com/privacypolicy?navigate=policy"
                          target="_blank"
                          className=" pl-[5px] pr-[5px] text-[#F7941D]"
                          rel="noreferrer"
                        >
                          Privacy Policy
                        </a>
                        and
                        <a
                          href="https://billwale.com/privacypolicy?navigate=terms"
                          target="_blank"
                          className="text-[#F7941D] pl-[5px]"
                          rel="noreferrer"
                        >
                          Terms of Service
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white w-full rounded-[7px] px-5 h-[580px] relative sm:p-8 shadow-main flex flex-col overflow-auto">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-[40px] font-[500] font-Poppins text-[#163151]">
                  Log In
                </h1>
              </div>

              <form onKeyDown={(e) => e.key === "Enter" && handleLogin()}>
                <div className="mt-14 space-y-8">
                  {/* Name Input */}
                  <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4 text-[#00000099]">
                    <label
                      htmlFor="name"
                      className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                   userName ||  nameFocused
                          ? "-translate-y-[50%] text-primary text-xs"
                          : "  -translate-y-[-55%] cursor-text  text-[#9f9e9e] text-xs"
                      }`}
                    >
                      User Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={nameFocused ? "" : ""}
                      className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                      onFocus={() => setNameFocused(true)}
                      onBlur={(e) => setNameFocused(e.target.value !== "")}
                    />
                  </div>
                  <div className="relative w-full border border-[#BCBCBC] py-4 px-4 rounded-lg flex items-center space-x-4 text-[#00000099]">
                    <label
                      htmlFor="password"
                      className={`bg-white px-1 absolute left-[20px] top-0 transform -translate-y-1/2 font-Poppins font-[300] text-primary text-sm sm:text-base capitalize transition-all duration-200 ${
                     password ||  passwordFocused
                          ? "-translate-y-[50%] text-primary text-xs"
                          : "  -translate-y-[-55%] cursor-text  text-[#9f9e9e] text-xs"
                      }`}
                    >
                      Password
                    </label>

                    <input
                       type={showPassword ? "text" : "password"}
                      name="name"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={passwordFocused ? "" : ""}
                      className="w-full outline-none text-[15px] font-Poppins font-[400] bg-transparent"
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={(e) => setPasswordFocused(e.target.value !== "")}
                    />

                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye text-[#122f97]" : "fa-eye-slash"
                      } text-[19px]  cursor-pointer`}
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

                  <div className="text-center  w-[87%]  mt-3">
                    <button
                      onClick={handleLogin}
                      type="button"
                      className="w-full bg-bill shadow-blue px-3 bg-[#122f97] py-4 rounded-md font-Poppins text-white text-xl font-medium"
                    >
                      Log in
                    </button>
                  </div>
                  <p className="text-sm sm:text-[12px]   text-left pl-[6px] font-Poppins mt-1  text-[#00000099]  mx-auto font-light  lg:mt-[10px]">
                    By Logging in, I agree with all
                    <a
                      href="https://billwale.com/privacypolicy?navigate=policy"
                      target="_blank"
                      className="text-[#F7941D]"
                      rel="noreferrer"
                    >
                      Privacy Policy
                    </a>
                    and
                    <a
                      href="https://billwale.com/privacypolicy?navigate=terms"
                      target="_blank"
                      className="text-[#F7941D]"
                      rel="noreferrer"
                    >
                      Terms of Service
                    </a>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
