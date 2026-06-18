import { useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import { Header } from "./components/NewAdControls";
import { locationKey } from "./data";
import { navigateTo, useRequireAuth } from "./utils";

export function NewAdLocationPage() {
  const label = new URLSearchParams(window.location.search).get("label") ?? "آگهی ملک";
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(window.localStorage.getItem(locationKey) ?? "");
  const locations = ["مشهد، صیاد شیرازی", "احمدآباد، خیابان عارف", "هاشمیه، بلوار هنرستان"].filter((item) => item.includes(query.trim()));

  useRequireAuth();

  return (
    <PageFrame className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]" variant="flush">
      <Header title="موقعیت ملک" />
      <main className="relative min-h-0 flex-1 bg-[#e9eef2]">
        <img alt="نقشه" className="absolute inset-0 h-full w-full object-cover" src="/figma/search/map-light.png" />
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-x-4 top-4 rounded-[14px] bg-white p-3 shadow-[0_8px_24px_rgba(26,26,26,0.12)]">
          <label className="flex h-12 items-center gap-3 rounded-[10px] border border-[#cccccc] px-3 text-right" dir="rtl">
            <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-[#808080]" fill="none" viewBox="0 0 24 24"><path d="M11 19a8 8 0 1 1 5.657-2.343L21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
            <input className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right outline-none placeholder:text-[#a6a6a6]" onChange={(event) => setQuery(event.target.value)} placeholder="جستجو" value={query} />
          </label>
          <div className="mt-3 space-y-2">
            {locations.map((item) => (
              <button className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-right text-sm font-medium leading-5 ${selectedLocation === item ? "bg-[#0048c414] text-[#0048c4]" : "bg-white text-[#1a1a1a]"}`} key={item} onClick={() => setSelectedLocation(item)} type="button">
                <span>{item}</span><span className="text-[#808080]">⌖</span>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0048c4] text-white shadow-[0_8px_18px_rgba(0,72,196,0.35)]">⌖</div>
      </main>
      <footer className="shrink-0 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-16px_24px_rgba(255,255,255,0.96)]">
        <button
          className="h-12 w-full rounded-[10px] bg-[#0048c4] text-base font-medium leading-6 text-white disabled:bg-[#e0e0e0] disabled:text-[#a6a6a6]"
          disabled={!selectedLocation}
          onClick={() => {
            window.localStorage.setItem(locationKey, selectedLocation);
            navigateTo(`/new-ad/details${window.location.search || `?label=${encodeURIComponent(label)}`}`);
          }}
          type="button"
        >
          تایید موقعیت
        </button>
      </footer>
    </PageFrame>
  );
}
