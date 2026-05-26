import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  ShoppingCart,
  Globe,
  ShieldAlert,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const FLAG_MAP = {
  UK: "🇬🇧",
  US: "🇺🇸",
  DE: "🇩🇪",
  FR: "🇫🇷",
  PK: "🇵🇰",
  SA: "🇸🇦",
  AE: "🇦🇪",
  TR: "🇹🇷",
  IN: "🇮🇳",
  CA: "🇨🇦",
  AU: "🇦🇺",
  BR: "🇧🇷",
  MX: "🇲🇽",
  JP: "🇯🇵",
  KR: "🇰🇷",
};

function inputClass(extra = "") {
  return `bg-[#1e293b]/50 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-[#25F4EE]/50 focus:outline-none transition-all ${extra}`;
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border font-bold text-sm uppercase tracking-widest transition-all ${
        type === "success"
          ? "bg-emerald-900/90 border-emerald-500/40 text-emerald-400"
          : "bg-red-900/90 border-red-500/40 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={18} />
      ) : (
        <AlertTriangle size={18} />
      )}
      {msg}
    </div>
  );
}

export default function AdminPanel() {
  const [activePage, setActivePage] = useState("admin");
  const [adminTab, setAdminTab] = useState("inventory");
  const [toast, setToast] = useState(null);
  const queryClient = useQueryClient();

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const { data: accounts = [], isLoading: loadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => fetch("/api/accounts").then((r) => r.json()),
  });
  const { data: regions = [], isLoading: loadingRegions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => fetch("/api/regions").then((r) => r.json()),
  });
  const { data: rules = [], isLoading: loadingRules } = useQuery({
    queryKey: ["decline-rules"],
    queryFn: () => fetch("/api/decline-rules").then((r) => r.json()),
  });

  const tabs = [
    { id: "inventory", label: "Inventory", icon: ShoppingCart },
    { id: "regions", label: "Regions", icon: Globe },
    { id: "rules", label: "Decline Rules", icon: ShieldAlert },
  ];

  // ─── INVENTORY TAB ────────────────────────────────────────────────────────
  function InventoryTab() {
    const [form, setForm] = useState({
      username: "",
      region: "",
      region_code: "",
      price: "",
      followers: "",
      following: "",
      likes: "",
      videos: "",
      niche: "",
      age: "",
      profile_image: "",
    });
    const [formErr, setFormErr] = useState("");

    const createMut = useMutation({
      mutationFn: (data) =>
        fetch("/api/accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      onSuccess: (data) => {
        if (data.error) {
          showToast(data.error, "error");
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        showToast("Account node created successfully!");
        setForm({
          username: "",
          region: "",
          region_code: "",
          price: "",
          followers: "",
          following: "",
          likes: "",
          videos: "",
          niche: "",
          age: "",
          profile_image: "",
        });
        setFormErr("");
      },
      onError: () => showToast("Failed to create account", "error"),
    });

    const deleteMut = useMutation({
      mutationFn: (id) =>
        fetch("/api/accounts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }).then((r) => r.json()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["accounts"] });
        showToast("Node deleted.");
      },
      onError: () => showToast("Failed to delete", "error"),
    });

    function handleSubmit(e) {
      e.preventDefault();
      if (!form.username || !form.region || !form.price) {
        setFormErr("Username, Region, and Price are required.");
        return;
      }
      setFormErr("");
      createMut.mutate(form);
    }

    return (
      <div className="space-y-6">
        <div className="bg-[#090d17] border border-white/5 rounded-3xl p-8">
          <h4 className="text-xl font-black text-white mb-6 uppercase tracking-widest">
            Add New TikTok Entity
          </h4>
          {formErr && (
            <div className="mb-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 p-3 rounded-xl text-[#FE2C55] text-sm font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> {formErr}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                placeholder="Username *"
                className={inputClass()}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <input
                placeholder="Region Name (e.g. United Kingdom) *"
                className={inputClass()}
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
              <input
                placeholder="Region Code (e.g. UK)"
                className={inputClass()}
                value={form.region_code}
                onChange={(e) =>
                  setForm({
                    ...form,
                    region_code: e.target.value.toUpperCase(),
                  })
                }
              />
              <input
                placeholder="Price (e.g. 49.99) *"
                type="number"
                step="0.01"
                className={inputClass()}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                placeholder="Followers"
                type="number"
                className={inputClass()}
                value={form.followers}
                onChange={(e) =>
                  setForm({ ...form, followers: e.target.value })
                }
              />
              <input
                placeholder="Following"
                type="number"
                className={inputClass()}
                value={form.following}
                onChange={(e) =>
                  setForm({ ...form, following: e.target.value })
                }
              />
              <input
                placeholder="Likes / Hearts"
                type="number"
                className={inputClass()}
                value={form.likes}
                onChange={(e) => setForm({ ...form, likes: e.target.value })}
              />
              <input
                placeholder="Video Count"
                type="number"
                className={inputClass()}
                value={form.videos}
                onChange={(e) => setForm({ ...form, videos: e.target.value })}
              />
              <input
                placeholder="Niche (e.g. Gaming, Lifestyle)"
                className={inputClass()}
                value={form.niche}
                onChange={(e) => setForm({ ...form, niche: e.target.value })}
              />
              <input
                placeholder="Age (e.g. 2 years)"
                className={inputClass()}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
              <input
                placeholder="Profile Image URL (optional)"
                className={inputClass("md:col-span-2")}
                value={form.profile_image}
                onChange={(e) =>
                  setForm({ ...form, profile_image: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="mt-2 px-8 py-4 bg-[#25F4EE] text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {createMut.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Create Node
            </button>
          </form>
        </div>

        <div className="bg-[#090d17] border border-white/5 rounded-3xl overflow-hidden">
          {loadingAccounts ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-[#25F4EE]" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="p-12 text-center text-[#94a3b8] text-sm uppercase font-bold tracking-widest opacity-40">
              No inventory nodes found
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Node</th>
                  <th className="px-6 py-4">Region</th>
                  <th className="px-6 py-4">Followers</th>
                  <th className="px-6 py-4">Likes</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="text-sm hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-bold">
                      @{acc.username}
                    </td>
                    <td className="px-6 py-4 text-[#94a3b8]">
                      {FLAG_MAP[acc.region_code] || "🌐"} {acc.region}
                    </td>
                    <td className="px-6 py-4 text-[#25F4EE]">
                      {acc.followers >= 1000
                        ? (acc.followers / 1000).toFixed(1) + "k"
                        : acc.followers || 0}
                    </td>
                    <td className="px-6 py-4 text-[#FE2C55]">
                      {acc.likes >= 1000
                        ? (acc.likes / 1000).toFixed(1) + "k"
                        : acc.likes || 0}
                    </td>
                    <td className="px-6 py-4 text-white font-black">
                      ${parseFloat(acc.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteMut.mutate(acc.id)}
                        disabled={deleteMut.isPending}
                        className="text-[#FE2C55] hover:scale-110 transition-transform disabled:opacity-40"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ─── REGIONS TAB ──────────────────────────────────────────────────────────
  function RegionsTab() {
    const [form, setForm] = useState({
      name: "",
      code: "",
      flag: "",
      conversion_fee: "4.99",
    });
    const [formErr, setFormErr] = useState("");

    const createMut = useMutation({
      mutationFn: (data) =>
        fetch("/api/regions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      onSuccess: (data) => {
        if (data.error) {
          showToast(data.error, "error");
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        showToast("Region created!");
        setForm({ name: "", code: "", flag: "", conversion_fee: "4.99" });
        setFormErr("");
      },
      onError: () => showToast("Failed to create region", "error"),
    });

    const deleteMut = useMutation({
      mutationFn: (id) =>
        fetch("/api/regions", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }).then((r) => r.json()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        showToast("Region removed.");
      },
      onError: () => showToast("Failed to delete region", "error"),
    });

    function handleSubmit(e) {
      e.preventDefault();
      if (!form.name || !form.code) {
        setFormErr("Name and Code are required.");
        return;
      }
      setFormErr("");
      createMut.mutate(form);
    }

    return (
      <div className="space-y-6">
        <div className="bg-[#090d17] border border-white/5 rounded-3xl p-8">
          <h4 className="text-xl font-black text-white mb-6 uppercase tracking-widest">
            Add Migration Destination
          </h4>
          {formErr && (
            <div className="mb-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 p-3 rounded-xl text-[#FE2C55] text-sm font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> {formErr}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Region Name (e.g. United Kingdom) *"
                className={inputClass()}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Region Code (e.g. UK) *"
                className={inputClass()}
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
              />
              <input
                placeholder="Flag Emoji (e.g. 🇬🇧)"
                className={inputClass()}
                value={form.flag}
                onChange={(e) => setForm({ ...form, flag: e.target.value })}
              />
              <input
                placeholder="Conversion Fee (e.g. 4.99)"
                type="number"
                step="0.01"
                className={inputClass()}
                value={form.conversion_fee}
                onChange={(e) =>
                  setForm({ ...form, conversion_fee: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="px-8 py-4 bg-[#25F4EE] text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {createMut.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Add Region
            </button>
          </form>
        </div>

        <div className="bg-[#090d17] border border-white/5 rounded-3xl overflow-hidden">
          {loadingRegions ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-[#25F4EE]" />
            </div>
          ) : regions.length === 0 ? (
            <div className="p-12 text-center text-[#94a3b8] text-sm uppercase font-bold tracking-widest opacity-40">
              No regions configured
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Flag</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Conversion Fee</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {regions.map((r) => (
                  <tr key={r.id} className="text-sm hover:bg-white/[0.02]">
                    <td className="px-6 py-4 text-2xl">{r.flag || "🌐"}</td>
                    <td className="px-6 py-4 text-white font-bold">{r.name}</td>
                    <td className="px-6 py-4 font-mono text-[#25F4EE]">
                      {r.code}
                    </td>
                    <td className="px-6 py-4 text-white">
                      ${parseFloat(r.conversion_fee || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteMut.mutate(r.id)}
                        disabled={deleteMut.isPending}
                        className="text-[#FE2C55] hover:scale-110 transition-transform disabled:opacity-40"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ─── DECLINE RULES TAB ────────────────────────────────────────────────────
  function RulesTab() {
    const [form, setForm] = useState({
      step_order: "",
      error_message: "",
      fixed_surcharge: "",
    });
    const [formErr, setFormErr] = useState("");
    const [showForm, setShowForm] = useState(false);

    const createMut = useMutation({
      mutationFn: (data) =>
        fetch("/api/decline-rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((r) => r.json()),
      onSuccess: (data) => {
        if (data.error) {
          showToast(data.error, "error");
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["decline-rules"] });
        showToast("Decline rule created!");
        setForm({ step_order: "", error_message: "", fixed_surcharge: "" });
        setShowForm(false);
        setFormErr("");
      },
      onError: () => showToast("Failed to create rule", "error"),
    });

    const deleteMut = useMutation({
      mutationFn: (id) =>
        fetch("/api/decline-rules", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }).then((r) => r.json()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["decline-rules"] });
        showToast("Rule deleted.");
      },
      onError: () => showToast("Failed to delete rule", "error"),
    });

    function handleSubmit(e) {
      e.preventDefault();
      if (!form.step_order || !form.error_message || !form.fixed_surcharge) {
        setFormErr("All fields are required.");
        return;
      }
      setFormErr("");
      createMut.mutate(form);
    }

    return (
      <div className="space-y-6">
        <div className="bg-[#090d17] border border-white/5 rounded-3xl p-8">
          <h4 className="text-xl font-black text-white mb-2 uppercase tracking-widest underline decoration-[#FE2C55] decoration-4 underline-offset-8">
            Decline Surcharge Engine
          </h4>
          <p className="text-[#94a3b8] mb-6 text-sm max-w-2xl">
            Configure multi-stage bank interception rules. Each rule applies a
            fixed surcharge when the attempt index matches.
          </p>

          {loadingRules ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={28} className="animate-spin text-[#25F4EE]" />
            </div>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-[#1e293b]/30 border border-white/5 rounded-2xl p-6 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FE2C55]/10 flex items-center justify-center text-[#FE2C55] font-black text-xl shrink-0">
                      {rule.step_order}
                    </div>
                    <div>
                      <p className="text-white font-bold tracking-wide">
                        {rule.error_message}
                      </p>
                      <p className="text-[#FE2C55] text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        Surcharge: +$
                        {parseFloat(rule.fixed_surcharge).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMut.mutate(rule.id)}
                    disabled={deleteMut.isPending}
                    className="p-2 text-[#94a3b8] hover:text-[#FE2C55] transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {showForm ? (
                <div className="bg-[#1e293b]/30 border border-[#25F4EE]/20 rounded-2xl p-6">
                  {formErr && (
                    <div className="mb-4 bg-[#FE2C55]/10 border border-[#FE2C55]/30 p-3 rounded-xl text-[#FE2C55] text-xs font-bold flex items-center gap-2">
                      <AlertTriangle size={14} /> {formErr}
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <input
                      placeholder="Step Order (e.g. 1)"
                      type="number"
                      className={inputClass()}
                      value={form.step_order}
                      onChange={(e) =>
                        setForm({ ...form, step_order: e.target.value })
                      }
                    />
                    <input
                      placeholder="Bank Error Message"
                      className={inputClass()}
                      value={form.error_message}
                      onChange={(e) =>
                        setForm({ ...form, error_message: e.target.value })
                      }
                    />
                    <input
                      placeholder="Surcharge Amount (e.g. 10.00)"
                      type="number"
                      step="0.01"
                      className={inputClass()}
                      value={form.fixed_surcharge}
                      onChange={(e) =>
                        setForm({ ...form, fixed_surcharge: e.target.value })
                      }
                    />
                    <div className="md:col-span-3 flex gap-3">
                      <button
                        type="submit"
                        disabled={createMut.isPending}
                        className="px-6 py-3 bg-[#FE2C55] text-white font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {createMut.isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                        Save Rule
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormErr("");
                        }}
                        className="px-6 py-3 border border-white/10 text-[#94a3b8] font-bold uppercase tracking-widest text-xs rounded-xl hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full h-16 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[#94a3b8] hover:border-[#25F4EE]/50 hover:text-[#25F4EE] transition-all"
                >
                  <Plus size={20} /> Add New Decline Protocol
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">
              Command Terminal
            </h2>
            <p className="text-[#FE2C55] font-bold text-xs uppercase tracking-[0.3em] mt-1">
              Status: Administrator Authorization Active
            </p>
          </div>
        </header>

        {/* Tab Nav */}
        <div className="flex gap-1 bg-[#090d17] p-1.5 rounded-2xl border border-white/5 w-fit flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                adminTab === tab.id
                  ? "bg-[#1e293b] text-[#25F4EE] shadow-lg shadow-black/50"
                  : "text-[#55647e] hover:text-white"
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {adminTab === "inventory" && <InventoryTab />}
          {adminTab === "regions" && <RegionsTab />}
          {adminTab === "rules" && <RulesTab />}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </Layout>
  );
}
