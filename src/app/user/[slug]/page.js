"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/service/userService";
import NavBar from "@/components/Navbar";
import { use, useEffect, useState } from 'react';

export default function User({ params }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (slug && token) {
      userService.getBySlug(slug, token).then(setTargetUser).catch(console.error);
    }
  }, [slug]);

  if (!user) return null;

  return (
    <div className="min-h-full">
      <NavBar />
      <header className="relative bg-[#003247] after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">User profile</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {targetUser ? (
            <>
              <h1>Welcome {user.firstName} {user.lastName}, this is the profile of: {targetUser.firstName} {targetUser.lastName}!</h1>
              <h2>Page slug: /user/{slug}.</h2>
            </>
          ) : (
            <p>User profile not found.</p>
          )}
        </div>
      </main>
    </div>
  )
}