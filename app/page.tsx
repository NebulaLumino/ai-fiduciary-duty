"use client";
import { useState } from "react";

export default function Home() {
  const [FiduciaryType, setFiduciaryType] = useState("");
  const [Assets, setAssets] = useState("");
  const [Beneficiaries, setBeneficiaries] = useState("");
  const [Concerns, setConcerns] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accentColor = "hsl(330,50%,55%)";

  const handleGenerate = async () => {
    const body = {
        FiduciaryType: FiduciaryType,
        Assets: Assets,
        Beneficiaries: Beneficiaries,
        Concerns: Concerns
      };
    if (!Object.values(body).some(v => v?.trim())) return;


    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOutput(data.result || data.error || "No response");
      if (data.error) setError(data.error);
    } catch (e: any) {
      setError("Error: " + e.message);
      setOutput("Error: " + e.message);
    }
    setLoading(false);
  };

  const allFilled = Boolean(FiduciaryType.trim() && Assets.trim() && Beneficiaries.trim() && Concerns.trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: accentColor }}>AI Fiduciary Duty Compliance Checklist</h1>
          <p className="text-gray-400 text-sm mt-0.5">Fiduciary Role, Assets Under Management, Beneficiaries/Stakeholders, Specific Compliance Concerns</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          DeepSeek-powered
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="p-6 lg:p-8 flex flex-col gap-5 border-r border-white/5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Input</div>
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fiduciary Role</label>
          <textarea
            id="fiduciarytype"
            value={FiduciaryType}
            onChange={e => setFiduciaryType(e.target.value)}
            placeholder="e.g. Corporate board member, Investment advisor, Trustee, Estate executor, Attorney-in-fact"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(330,50%,55%)] resize-none"
            rows={3}
          />
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Assets Under Management</label>
          <textarea
            id="assets"
            value={Assets}
            onChange={e => setAssets(e.target.value)}
            placeholder="e.g. $50M trust corpus, $10M investment portfolio, corporate assets of LLC"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(330,50%,55%)] resize-none"
            rows={3}
          />
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Beneficiaries/Stakeholders</label>
          <textarea
            id="beneficiaries"
            value={Beneficiaries}
            onChange={e => setBeneficiaries(e.target.value)}
            placeholder="e.g. Trust beneficiaries (John, Mary), Corporation shareholders, LLC members"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(330,50%,55%)] resize-none"
            rows={3}
          />
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Specific Compliance Concerns</label>
          <textarea
            id="concerns"
            value={Concerns}
            onChange={e => setConcerns(e.target.value)}
            placeholder="e.g. Potential conflict of interest in related-party transaction, self-dealing question, investment diversification"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[hsl(330,50%,55%)] resize-none"
            rows={3}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !allFilled}
            className="rounded-lg py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? "Analyzing..." : "Generate Analysis"}
          </button>
        </div>

        <div className="p-6 lg:p-8 flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Output</div>
          <div className="flex-1 bg-gray-900/60 border border-white/10 rounded-lg p-5 text-sm text-gray-300 whitespace-pre-wrap overflow-auto prose prose-invert prose-sm max-w-none">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                Analyzing your legal question...
              </span>
            ) : output ? (
              output
            ) : (
              <span className="text-gray-600">Response will appear here.</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
