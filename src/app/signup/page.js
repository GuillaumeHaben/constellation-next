"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import icon from '../../../public/img/icon.png';

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "", repeatPassword: "" });
  const [error, setError] = useState("");
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setPendingConfirmation(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPendingConfirmation(false);

    const email = form.email.toLowerCase();
    if (!email.endsWith('@esa.int') && !email.endsWith('@ext.esa.int')) {
      setError("Registration is restricted to @esa.int and @ext.esa.int domains.");
      return;
    }

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email, // using email as username
          email: form.email,
          password: form.password,
          // Names are now extracted from email by backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error?.message || "Registration failed";
        // Treat "Error sending confirmation email" as success
        if (errorMessage === "Error sending confirmation email") {
          setPendingConfirmation(true);
          return;
        }
        setError(errorMessage);
        return;
      }

      // Show the manual confirmation message
      setPendingConfirmation(true);

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full sm:max-w-sm">
          <Link href="/">
            <Image
              alt="Constellation"
              src={icon}
              className="mx-auto size-16 w-auto"
              width={64}
              height={64}
            />
          </Link>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create your account</h2>
          <div className="mt-4 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-sm text-indigo-300 text-center">
              Registration is restricted to <span className="text-indigo-200 font-semibold">ESA employees and contractors</span> (@esa.int or @ext.esa.int).
            </p>
          </div>
        </div>
        <div className="mt-10 w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john.doe@esa.int"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="repeatPassword" className="block text-sm/6 font-medium text-gray-100">
                  Repeat password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="repeatPassword"
                  name="repeatPassword"
                  value={form.repeatPassword}
                  onChange={handleChange}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer"
              >
                Sign up
              </button>
            </div>
            {error && <div className="mt-4 p-4 rounded-lg bg-danger-500/10 border border-danger-500/20">
              <p className="text-sm text-danger-400 text-center">{error}</p>
            </div>}
            {pendingConfirmation &&
              <div className="mt-4 p-4 rounded-lg bg-success-500/10 border border-success-500/20">
                <p className="text-sm text-success-400 text-center"><b>Account successfully created</b><br />An Admin will approve you account creation shortly. Sit tight and relax.</p>
              </div>}
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already a ⭐?{' '}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}