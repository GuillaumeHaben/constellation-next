"use client";

import { useAuth } from "@/context/AuthContext";
import { userService } from "@/service/userService";
import NavBar from "@/components/Navbar";
import { use } from 'react'; 

export default async function User({ params}) {
  const { id } = use(params);
  const { user } = useAuth();

  if (!user) return null;
  console.log(user);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const targetUser =  await userService.getUserById(id, token);

  !!targetUser && console.log(targetUser);

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

          <h1>Welcome {user.email}, this is the profile of: {targetUser.id}!</h1>
          <h2>Page slug: {id}.</h2>
          
        </div>
      </main>
    </div>
  )
}