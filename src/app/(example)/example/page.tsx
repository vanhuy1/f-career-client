"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  useUser,
  useUserLoading,
  useUserError,
} from "@/store/feature/userSlice";
import { LoadingState } from "@/store/store.model";

const Example = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const user = useUser();
  const loadingState = useUserLoading();
  const errors = useUserError();

  const isLoading = loadingState === LoadingState.loading;

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(loginFailure("Please enter a valid email address"));
      return;
    }
    if (!password) {
      dispatch(loginFailure("Password is required"));
      return;
    }

    dispatch(loginStart());

    const userData = {
      id: "1",
      name: "Test User",
      email: email,
      isAuthenticated: true,
    };
    dispatch(loginSuccess(userData));
    setEmail("");
    setPassword("");
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {!user?.isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Login"}
          </button>
          {errors && <p style={{ color: "red" }}>{errors}</p>}
        </form>
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} disabled={isLoading}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Example;
