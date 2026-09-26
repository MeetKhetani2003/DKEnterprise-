"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, Globe } from "lucide-react";

export function Login({ onLogin }: { onLogin: (role: string, username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.role, data.username);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden font-sans">
      {/* Background Left - Building Image */}
      <div 
        className="absolute inset-0 w-full lg:w-3/5 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/login-bg.jpg')" }}
      />
      
      {/* Background Right - Dark Slanted */}
      <div 
        className="absolute inset-0 lg:left-[45%] right-0 bg-[#353b40] z-10"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="hidden lg:flex items-center justify-end h-full px-16 lg:px-24">
          <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-md ml-auto">
            DK Enterprise: A trusted leader delivering integrated facility management, 
            security services, and environmental support across critical sectors. 
            We are dedicated to providing comprehensive and tailored solutions 
            for complex environments.
          </p>
        </div>
        
        {/* Subtle decorative star in bottom right */}
        <div className="absolute bottom-16 right-16 opacity-20 hidden lg:block">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
        </div>
      </div>

      {/* Decorative Gold & Blue lines mimicking the image */}
      <div 
        className="absolute inset-0 z-0 hidden lg:block pointer-events-none"
      >
        {/* Gold accent line */}
        <div 
          className="absolute top-0 bottom-0 left-[44%] w-8 bg-[#b59a6d]"
          style={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 0 100%)' }}
        />
        {/* Navy accent line */}
        <div 
          className="absolute top-0 bottom-0 left-[43%] w-12 bg-[#0B2447]"
          style={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* Login Card Container */}
      <div className="relative z-20 flex flex-1 items-center justify-center lg:justify-start lg:pl-[20%] p-4">
        
        <div className="bg-white rounded-xl shadow-2xl p-10 max-w-md w-full border-t-4 border-[#0B2447]">
          
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-2">
              <Image src="/logos/logo.png" alt="DK Enterprise" width={180} height={56} className="h-14 w-auto object-contain" />
            </div>
            <h2 className="text-xl font-bold text-[#0B2447] mt-3">Tender Management System</h2>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B2447] focus:border-[#0B2447]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B2447] focus:border-[#0B2447]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2447] text-white font-medium rounded-lg py-3 hover:bg-[#11315e] transition duration-200 disabled:opacity-70 mt-2 shadow-md"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            
          </form>
        </div>
      </div>

    </div>
  );
}
