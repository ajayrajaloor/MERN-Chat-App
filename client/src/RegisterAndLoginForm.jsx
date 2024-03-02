import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "./userContext";

function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");

  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login'
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 409) {
        setError("Username already in use. Please login.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  }
  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="username"
          className="block w-full mb-2 p-2 border "
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
          className="block w-full mb-2 p-2 border "
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?
              <button onClick={() => setIsLoginOrRegister("login")}>
                Login here
              </button>
            </div>
          )}

        {isLoginOrRegister === 'login' && (
          <div>
            Don't have an account?
              <button onClick={() => setIsLoginOrRegister("register")}>
                Register
              </button>
          </div>
        )}

        </div>
      </form>
    </div>
  );
}

export default RegisterAndLoginForm;
