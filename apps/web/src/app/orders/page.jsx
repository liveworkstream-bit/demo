import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

export default function MyOrders() {
  const [activePage, setActivePage] = useState("orders");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("/api/orders").then((res) => res.json()),
  });

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Financial Records
          </h2>
          <p className="text-[#94a3b8] mt-1">
            Telemetry log of all authorized node transfers and migrations.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#090d17] h-24 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#090d17] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Protocol Type</th>
                    <th className="px-8 py-5">Base Fee</th>
                    <th className="px-8 py-5">Total Deducted</th>
                    <th className="px-8 py-5">Timestamp</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders?.length > 0 ? (
                    orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <span className="font-mono text-white text-sm">
                            #TR-{order.id.toString().padStart(5, "0")}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#25F4EE]" />
                            <span className="text-white font-bold uppercase tracking-tight text-xs">
                              {order.item_type === "account"
                                ? "Node Acquisition"
                                : "Cluster Migration"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[#94a3b8] text-sm">
                            ${order.base_price}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-white font-black text-sm tracking-tight">
                            ${order.total_paid}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[#94a3b8] text-xs font-medium uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full w-fit border border-emerald-500/20">
                            <CheckCircle2 size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Finalized
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <FileText size={48} />
                          <p className="text-sm font-bold uppercase tracking-widest">
                            No transaction logs detected
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#090d17] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <ShieldCheck className="text-[#25F4EE] mb-4" size={32} />
              <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                Security Audit Complete
              </h4>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                All transactions are logged with SHA-256 encryption. For any
                discrepancies, contact your root administrator via the secure
                terminal.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={120} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FE2C55]/10 to-[#090d17] border border-[#FE2C55]/20 rounded-3xl p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <DollarSign className="text-[#FE2C55] mb-4" size={32} />
              <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight">
                Cumulative Telemetry
              </h4>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Total authority acquisitions this cycle:{" "}
                <span className="text-white font-bold tracking-widest">
                  128.42k Units
                </span>
                . Migration success rate maintained at{" "}
                <span className="text-emerald-500 font-bold">99.8%</span>.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign size={120} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
