"use client";

import Link from "next/link";
import { Users, Briefcase, FileText, TrendingUp, ShoppingCart, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Clients", value: "18", change: "18 Logos", icon: Users, color: "text-blue-500", bg: "bg-blue-50", href: "/admin/clients" },
    { title: "Active Services", value: "8", change: "+0%", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50", href: "/admin/services" },
    { title: "Shop Equipment", value: "12", change: "Live", icon: ShoppingCart, color: "text-red-500", bg: "bg-red-50", href: "/admin/shop" },
    { title: "New Messages", value: "24", change: "+18%", icon: FileText, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const CardContent = (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200 transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-500">{stat.title}</div>
            </div>
          );

          return stat.href ? (
            <Link key={idx} href={stat.href}>
              {CardContent}
            </Link>
          ) : (
            <div key={idx}>{CardContent}</div>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button className="text-sm font-medium text-[#E62E2D] hover:text-red-700">View All</button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium mb-1">
                  New equipment inquiry received for <span className="font-bold">Hydraulic Excavator 20 Ton</span>
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
