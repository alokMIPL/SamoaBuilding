'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Rocket, 
  Building2, 
  Cpu, 
  Zap, 
  Compass, 
  Train, 
  Factory, 
  ShieldAlert, 
  FlaskConical, 
  Shield, 
  GraduationCap, 
  Sprout, 
  HeartPulse, 
  Plus, 
  Minus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const categories = [
  { name: 'All', count: 41, icon: Globe, active: true },
  { name: 'Space', count: 1, icon: Rocket },
  { name: 'Infrastructure', count: 7, icon: Building2 },
  { name: 'AI & Technology', count: 2, icon: Cpu },
  { name: 'Energy', count: 4, icon: Zap },
  { name: 'Startups', count: 3, icon: Compass },
  { name: 'Transportation', count: 6, icon: Train },
  { name: 'Manufacturing', count: 5, icon: Factory },
  { name: 'Public Systems', count: 3, icon: ShieldAlert },
  { name: 'Research', count: 3, icon: FlaskConical },
  { name: 'Defence Technology', count: 2, icon: Shield },
  { name: 'Education', count: 2, icon: GraduationCap },
  { name: 'Agriculture', count: 2, icon: Sprout },
  { name: 'Healthcare', count: 1, icon: HeartPulse },
];

export default function SamoaMap() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [timeframe, setTimeframe] = useState('48 HOURS');

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0c0d12] text-white font-sans select-none">
      
      {/* Background Gradient Glow */}
      <div 
        className="pointer-events-none absolute inset-0 transition-all duration-700 opacity-60" 
        style={{ 
          background: 'radial-gradient(ellipse 72% 66% at 50% 48%, rgba(214,120,60,0.12) 0%, rgba(150,70,120,0.08) 30%, rgba(60,60,150,0.05) 52%, transparent 86%)' 
        }} 
        aria-hidden="true"
      />

      {/* Top Left Header Card */}
      <div className="absolute top-6 left-6 z-20 w-72 bg-[#14151c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-sm font-bold tracking-wider text-orange-400">
            INDIA IS <span className="text-white">बिल्डिंग</span>
          </h1>
        </div>
        <div className="inline-block bg-orange-500/20 text-orange-300 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full mb-3">
          INDEPENDENCE WEEK EDITION
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          <strong className="text-white font-semibold">41</strong> things moved India forward in the last 48 hours.
        </p>
      </div>

      {/* Top Right Stats & Contribute Panel */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3">
        <div className="bg-[#14151c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex flex-col gap-1 w-44 shadow-2xl">
          <button className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white transition">
            <span>TODAY</span>
            <span className="font-medium text-white">1</span>
          </button>
          <button className="flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/10 text-white font-medium shadow-inner">
            <span>48 HOURS</span>
            <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md text-[10px]">41</span>
          </button>
          <button className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white transition">
            <span>ALL TIME</span>
            <span className="font-medium text-white">167</span>
          </button>
        </div>

        <button className="bg-[#14151c]/90 hover:bg-[#1f202b] border border-white/10 text-xs font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Contribute a signal</span>
        </button>
      </div>

      {/* Left Sidebar Category Filter */}
      <div className="absolute top-36 left-6 z-20 w-64 max-h-[calc(100vh-170px)] overflow-y-auto pr-1 custom-scrollbar">
        <div className="bg-[#14151c]/70 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition ${
                  isActive 
                    ? 'bg-white/10 text-white font-medium shadow' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-gray-500'}`} />
                  <span>{cat.name}</span>
                </div>
                <span className="text-[11px] text-gray-500 bg-black/30 px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Map Stage / Canvas Area */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Placeholder wrapper for map vector/canvas layer */}
        <div className="relative w-[600px] h-[750px] flex items-center justify-center">
          {/* Simulated node pin markers mapped across regions */}
          <div className="absolute top-28 left-40 w-6 h-6 rounded-full bg-orange-500/30 border border-orange-400 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
          </div>
          <div className="absolute top-44 left-44 w-8 h-8 rounded-full bg-orange-600/30 border border-orange-500 flex items-center justify-center shadow-lg">
            <span className="text-[10px] font-bold text-orange-200">9</span>
          </div>
          <div className="absolute top-[45%] left-[55%] w-7 h-7 rounded-full bg-pink-500/30 border border-pink-400 flex items-center justify-center">
            <span className="text-[10px] font-bold text-pink-200">3</span>
          </div>
          <div className="absolute top-[65%] left-[45%] w-7 h-7 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center">
            <span className="text-[10px] font-bold text-purple-200">8</span>
          </div>
        </div>
      </div>

      {/* Bottom Center Zoom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center bg-[#14151c]/80 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 shadow-xl gap-3">
        <button className="text-gray-400 hover:text-white transition p-1">
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-gray-300 tracking-wider">100%</span>
        <button className="text-gray-400 hover:text-white transition p-1">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Right "Dear India, 2047" Card */}
      <div className="absolute bottom-6 right-6 z-20 w-80 bg-[#14151c]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl">
        <h3 className="text-[11px] font-bold tracking-wider text-orange-400 uppercase mb-1">
          DEAR INDIA, 2047
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          India turns 100 in 2047. What do you hope we build by then?
        </p>
        <div className="flex items-center justify-between text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2.5 rounded-xl cursor-pointer transition group">
          <span>Write a note</span>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
        </div>
        <div className="text-[10px] text-center text-gray-500 mt-2.5">
          Read what others hope for →
        </div>
      </div>

    </div>
  );
}