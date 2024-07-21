import React, { useState, FormEvent } from "react";
import { auth } from "../../firebasy/firebasyConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../../apps/userslice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<FormData>({ email: "", password: "" });
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(login(user));
        navigate("/");
        message.success("You have successfully logged into your account");
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(login(user));
        navigate("/");
        message.success("You have successfully logged into your account");
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  return (
    <div data-theme="light" className="hero min-h-screen">
      <div className="hero-content flex-col">
        <div className="text-center">
          <p className="py-6 w-[400px]"></p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <h1 className="text-[#394E6A] text-5xl text-center">Login</h1>
              <span className="my-2">Email</span>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="email"
                  className="grow"
                  placeholder="Enter your Email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                  required
                />
              </label>
            </div>
            <div className="form-control">
              <span className="my-2">Password</span>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="grow"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  value={data.password}
                  required
                />
              </label>
            </div>
            <div className="form-control mt-6 gap-4">
              <button className="btn btn-primary" type="submit">
                Sign in
              </button>
              <button
                className="btn text-white  bg-black rounded-full"
                type="button"
                onClick={handleGoogleSignIn}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="25px"
                  height="25px"
                >
                  <path
                    fill="#4285F4"
                    d="M44.5,20H24v8.5h11.9C34.7,34,30.1,37,24,37c-7.2,0-13-5.8-13-13s5.8-13,13-13c3.3,0,6.3,1.2,8.6,3.1l6.3-6.3C34.6,4.4,29.6,2.5,24,2.5C12,2.5,2.5,12,2.5,24S12,45.5,24,45.5C36,45.5,45.5,36,45.5,24C45.5,22.7,45.3,21.3,44.5,20z"
                  />
                  <path
                    fill="#34A853"
                    d="M6.5,14.3l6.5,4.8c1.7-4.1,5.7-7,10.4-7c3.1,0,5.9,1.2,8,3.1L37.7,8C33.6,4.4,29,2.5,24,2.5C16.1,2.5,9.1,7.1,6.5,14.3z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24,45.5c4.9,0,9.4-1.9,12.7-5l-6.4-5.5c-1.9,1.5-4.3,2.5-7,2.5c-4.8,0-8.8-3.1-10.2-7.3l-6.5,5C9.1,40.9,16.1,45.5,24,45.5z"
                  />
                  <path
                    fill="#EA4335"
                    d="M44.5,20H24v8.5h11.9c-1,2.7-3.1,4.8-5.8,6.1l6.4,5C39.5,37.5,45.5,31.5,45.5,24C45.5,22.7,45.3,21.3,44.5,20z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            <Link
              className="text-center mt-4 btn btn-secondary"
              style={{ textDecoration: "none", color: "#fff" }}
              to={"/signup"}
            >
              Not a member yet? Sign up
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
