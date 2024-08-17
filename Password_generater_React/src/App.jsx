import React, { useState, useEffect } from "react";
import {axiosInstance} from './servies/axios';

function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [copied, setCopied] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    emojis: true,
    math: true,
  });

  /**
   * Copies the generated password to the clipboard
   * and sets the copied state to true.
   * After 3 seconds, it resets the copied state to false.
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  /**
   * Updates the email state variable with the value from the input event.
   * This allows the email value to be updated as the user types in the input.
   */
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  /**
   * Handles submitting the email form.
   * Prevents default form submission behavior.
   * Sets loading state to true.
   * Makes API call to email endpoint with email and password data.
   * Handles promise resolution and rejection.
   * On finally, sets loading state back to false.
   */
  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const emailApiUrl = "send-password-to-email/";

    const emailSendData = {
      email: email,
      password: generatedPassword,
    };

    axiosInstance
      .post(emailApiUrl, emailSendData)
      .then((response) => {})
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Handles change events from the password length slider input.
   * Parses the slider value to an integer and updates the passwordLength state with the new value.
   */
  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setPasswordLength(value);
  };

  /**
   * Handles change events from the password complexity checkboxes.
   * Updates the checkboxValues state object with the new checked value.
   * Spread operator is used to merge previous state with updated key/value pair.
   */
  const handleCheckboxChange = (checkbox) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkbox]: !prevValues[checkbox],
    }));
  };

  /**
   * Generates a random password by making a request
   * to the password generation API.
   *
   * Constructs the request payload from component state,
   * including password length and complexity options.
   *
   * Makes the API request, sets the generated password in state
   * on success, and logs any errors.
   */
  const generatePassword = () => {
    const apiUrl = "generate-password/";

    const requestData = {
      length: passwordLength,
      complexity: Object.keys(checkboxValues).filter(
        (key) => checkboxValues[key]
      ),
    };

    axiosInstance
      .post(apiUrl, requestData)
      .then((response) => {
        setGeneratedPassword(response.data.password);
      })
      .catch((error) => {
        console.error("Error generating password:", error);
      });
  };

  useEffect(() => {
    generatePassword();
  }, [passwordLength, checkboxValues]);

  return (
    <>
      <div className="bg-black flex items-center justify-center h-screen">
        <div className="bg-blue-400 p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
            <span className="text-transparent bg-clip-text bg-black">
              Password Generator
            </span>
          </h1>
          <p className="text-base mb-4 font-normal text-black-500 lg:text-base">
            Elevate Your Security, Empower Your Passwords!
          </p>

          <div className="mb-4 h-12 bg-blue-100 rounded-md flex items-center justify-between px-4">
            <span>{generatedPassword}</span>
            <button
              onClick={copyToClipboard}
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
            >
              {copied ? (
                <i className="fa fa-check-circle" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-clipboard" aria-hidden="true"></i>
              )}
            </button>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password-length"
            >
              Password Length{" "}
              <span className="bg-gray-200 p-1 rounded-md">
                {passwordLength}
              </span>
            </label>
            <input
              id="password-length"
              type="range"
              min={1}
              max={28}
              value={passwordLength}
              onChange={handleSliderChange}
              className="slider w-full h-2 bg-gray-200 rounded-full appearance-none"
            />
          </div>

          {/* Checkbox inputs */}
          <div className="mb-4">
            <div className="mb-6">
              <div className="grid grid-cols-2">
                {Object.keys(checkboxValues).map((checkbox) => (
                  <label key={checkbox} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={checkboxValues[checkbox]}
                      onChange={() => handleCheckboxChange(checkbox)}
                    />
                    <span className="ml-2">
                      {checkbox.charAt(0).toUpperCase() + checkbox.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={handleEmailChange}
                className="border rounded-md mb-2 w-full py-2 px-3"
                required
              />

              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 inline-block mr-1 hover:cursor-wait"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V2.83A10 10 0 002 12h2zm15.55-1.64A10 10 0 0022 12h-2a8 8 0 01-7.55 7.36V18h-2v-2.64zM6 14h2v2H6v-2zm2-6H6v2h2V8zm0-4H6v2h2V4zm0 8H6v2h2v-2zm10-8h-2v2h2V4zm0 4h-2v2h2V8zm0 4h-2v2h2v-2z"
                    ></path>
                  </svg>
                ) : (
                  <span
                    className="inline-block mr-1"
                    role="img"
                    aria-label="Email Icon"
                  >
                    📧
                  </span>
                )}
                Just Email It !
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
