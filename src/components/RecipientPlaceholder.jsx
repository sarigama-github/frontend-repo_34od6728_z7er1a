import React from 'react';
import { useStore } from './StoreContext';
import { Smile } from 'lucide-react';

export default function RecipientPlaceholder(){
  const { user, logout } = useStore();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-900 p-6 text-center">
      <div>
        <Smile className="mx-auto text-emerald-600" />
        <h1 className="text-xl font-bold mt-2">Hi {user?.name}!</h1>
        <p className="text-slate-600 mt-2 max-w-xs">Recipient experience is coming next. For now, try the Shopper view to explore the flow.</p>
        <button onClick={logout} className="mt-4 h-12 px-6 rounded-xl bg-slate-900 text-white">Log out</button>
      </div>
    </div>
  );
}
