import React, { useMemo, useState } from 'react';
import { useStore } from './StoreContext';
import { Wallet, MapPin, Navigation, DollarSign, Camera, CheckCircle2, LogOut } from 'lucide-react';

function distanceKm(a, b){
  const toRad = (d)=>d*Math.PI/180;
  const R=6371;
  const dLat=toRad(b.lat-a.lat);
  const dLon=toRad(b.lng-a.lng);
  const lat1=toRad(a.lat); const lat2=toRad(b.lat);
  const x=Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

export default function DriverDashboard(){
  const { user, mockLocation, availableOrders, activeOrder, acceptOrder, completeDelivery, logout } = useStore();
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);

  const cards = useMemo(()=> availableOrders.map(o=>{
    const dist = distanceKm(mockLocation, { lat:o.recipient_lat, lng:o.recipient_lng});
    return { ...o, distanceMiles: (dist*0.621371).toFixed(1) };
  }), [availableOrders, mockLocation]);

  const onAccept = async (order) => {
    setProcessing(true);
    await new Promise(r=>setTimeout(r, 1200));
    const res = acceptOrder(order.id);
    setProcessing(false);
    if (!res.ok){
      alert(res.message);
    } else {
      setSelected(null);
    }
  };

  const onComplete = async () => {
    if (!activeOrder) return;
    if (!uploadUrl) { alert('Please upload proof photo'); return; }
    setProcessing(true);
    await new Promise(r=>setTimeout(r, 1000));
    const res = completeDelivery(activeOrder.id, uploadUrl);
    setProcessing(false);
    if (res.ok){
      setUploadUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Balance</p>
            <p className="text-lg font-bold">${user.wallet_balance.toFixed(2)}</p>
          </div>
        </div>
        <button onClick={logout} className="text-sm text-slate-500 underline">Log out</button>
      </header>

      {!activeOrder && (
        <>
          <div className="px-4">
            <div className="w-full h-52 bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-white/90 rounded-xl px-3 py-1 text-xs font-medium shadow flex items-center gap-1">
                <MapPin size={14} className="text-emerald-600" /> You are near SoMa, SF
              </div>
              <div className="text-slate-500 text-sm">Map placeholder (mocked location)</div>
            </div>
          </div>
          <div className="px-4 mt-4 mb-24">
            <h2 className="text-base font-semibold mb-3">Available Orders</h2>
            <div className="space-y-3">
              {cards.map(order => (
                <button key={order.id} onClick={()=>setSelected(order)} className="w-full text-left bg-white rounded-2xl border border-slate-200 p-4 shadow-sm active:scale-[.99]">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{order.store_name}</div>
                    <div className="text-emerald-600 font-bold">${order.delivery_fee.toFixed(2)}</div>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Drop-off {order.distanceMiles} miles away</div>
                  <div className="text-xs text-slate-500 mt-2">Hold: ${order.item_value.toFixed(2)}</div>
                </button>
              ))}
              {cards.length===0 && (
                <div className="text-center text-slate-500 text-sm py-10">No orders nearby right now</div>
              )}
            </div>
          </div>
        </>
      )}

      {activeOrder && (
        <div className="px-4 mt-2 flex-1">
          <div className="w-full h-56 bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 left-2 bg-white/90 rounded-xl px-3 py-1 text-xs font-medium shadow flex items-center gap-1">
              <Navigation size={14} className="text-emerald-600" /> Navigating to destination
            </div>
            <div className="text-slate-500 text-sm">Route: {activeOrder.store_name} → Recipient</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active delivery</p>
                <p className="font-semibold">{activeOrder.store_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Reward</p>
                <p className="text-emerald-600 font-bold">${activeOrder.delivery_fee.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Camera size={16} className="text-slate-500" /> Upload proof of delivery
              </label>
              <input type="file" accept="image/*" onChange={(e)=>{
                const f=e.target.files?.[0];
                if (f) {
                  const url=URL.createObjectURL(f);
                  setUploadUrl(url);
                }
              }} className="mt-2"/>
              {uploadUrl && (
                <img src={uploadUrl} alt="proof" className="mt-2 h-24 w-24 object-cover rounded-lg border" />
              )}
            </div>

            <button onClick={onComplete} disabled={processing} className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold mt-4 flex items-center justify-center gap-2 active:scale-[.99]">
              {processing ? 'Processing...' : (<><CheckCircle2 /> Arrived & Delivered</>)}
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50" onClick={()=>!processing && setSelected(null)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-4 border border-slate-200" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">{selected.store_name}</div>
              <div className="text-emerald-600 font-bold">${selected.delivery_fee.toFixed(2)}</div>
            </div>
            <div className="text-sm text-slate-600 mt-1">Hold required: ${selected.item_value.toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-1">Drop-off distance: {selected.distanceMiles} miles</div>
            <button onClick={()=>onAccept(selected)} disabled={processing} className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold mt-4 flex items-center justify-center gap-2 active:scale-[.99]">
              {processing ? 'Authorizing...' : (<><DollarSign /> Accept & Authorize Hold</>)}
            </button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex items-center justify-around">
        <button className="flex flex-col items-center text-emerald-600">
          <MapPin size={20} />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <DollarSign size={20} />
          <span className="text-xs">Earnings</span>
        </button>
        <button onClick={logout} className="flex flex-col items-center text-slate-400">
          <LogOut size={20} />
          <span className="text-xs">Exit</span>
        </button>
      </nav>
    </div>
  );
}
