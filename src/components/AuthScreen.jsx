import React, { useState } from 'react';
import { useStore } from './StoreContext';
import { User, Truck, Mail, KeyRound } from 'lucide-react';
import Spline from '@splinetool/react-spline';

export default function AuthScreen() {
  const { login } = useStore();
  const [role, setRole] = useState('driver');
  const [name, setName] = useState('Alex');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    login(name || 'Alex', role);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <div className="relative h-72 w-full">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </div>

      <div className="px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="text-emerald-600" />
            <h1 className="text-xl font-bold">Neighborhood Carrier</h1>
          </div>
          <p className="text-slate-600 mb-4">Crowdsourced deliveries for your community.</p>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button onClick={() => setRole('driver')} className={`flex-1 h-10 rounded-lg text-sm font-medium ${role==='driver' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}>I am a Shopper</button>
            <button onClick={() => setRole('recipient')} className={`flex-1 h-10 rounded-lg text-sm font-medium ${role==='recipient' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}>I am a Recipient</button>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 h-12">
              <User size={18} className="text-slate-500" />
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="bg-transparent outline-none w-full" />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 h-12">
              <Mail size={18} className="text-slate-500" />
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="bg-transparent outline-none w-full" />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 h-12">
              <KeyRound size={18} className="text-slate-500" />
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="bg-transparent outline-none w-full" />
            </div>
            <button type="submit" className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold shadow active:scale-[.99]">Continue</button>
          </form>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">This is a demo. Authentication is mocked.</p>
    </div>
  );
}
