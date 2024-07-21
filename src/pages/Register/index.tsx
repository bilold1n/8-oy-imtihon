import { useState, FormEvent } from "react";
import { auth } from "../../firebasy/firebasyConfig";
import { useDispatch } from "react-redux";
import { login } from "../../apps/userslice";
import {
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";
import { message } from "antd";

interface FormData {
  email: string;
  password: string;
}

interface ProfileData {
  username: string;
  images: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<FormData>({ email: "", password: "" });
  const [malumot, setMalumot] = useState<ProfileData>({
    username: "",
    images: "",
  });
  const navigate = useNavigate();

  const registergoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        dispatch(login(user));
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
        message.success("Registered successfully");
      })

      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser!, {
          displayName: malumot.username,
          photoURL: malumot.images,
        })
          .then(() => {
            dispatch(login(auth.currentUser!.providerData[0]));
            navigate("/");
            localStorage.setItem(
              "user",
              JSON.stringify(auth.currentUser!.providerData[0])
            );
            message.success("Registered successfully");
          })
          .catch((error) => {
            message.error(error.message);
          });

        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        localStorage.setItem("users", JSON.stringify([...storedUsers, user]));
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div data-theme="light" className="hero min-h-scree">
      <div className="hero-content flex-col w-[600px]">
        <div className="card shrink-0 max-w-sm shadow-2xl w-full">
          <form onSubmit={handleSubmit} className="card-body">
            <h2 className="text-5xl font-serif text-[#394E6A] text-center mb-4">
              Register!
            </h2>
            <div className="form-control ">
              <span className="my-1">Username</span>

              <label className="input input-bordered flex items-center gap-1">
                <svg
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  required
                  placeholder="Enter your Name"
                  onChange={(e) =>
                    setMalumot({ ...malumot, username: e.target.value })
                  }
                  value={malumot.username}
                />
              </label>
              <span className="my-1">Avatar</span>
              <label className="input input-bordered flex items-center gap-1">
                <svg
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="url"
                  placeholder="Enter your Images"
                  className="grow"
                  required
                  onChange={(e) =>
                    setMalumot({ ...malumot, images: e.target.value })
                  }
                  value={malumot.images}
                />
              </label>
              <span className="my-1">Email</span>
              <label className="input input-bordered flex items-center gap-1">
                <svg
                  width={16}
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
                  required
                  placeholder="Enter your Email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  value={data.email}
                />
              </label>
            </div>
            <div className="form-control">
              <span className="my-2">Password</span>
              <label className="input input-bordered flex items-center gap-1">
                <svg
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-4 h-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 1 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="grow"
                  required
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  value={data.password}
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">
                Sign up
              </button>
            </div>
            <button
              onClick={registergoogle}
              className="btn bg-black rounded-full text-white"
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
              Sign up with Google
            </button>
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              className="text-center mt-1 btn btn-secondary"
              to="/login"
            >
              Already a member? Sign in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
