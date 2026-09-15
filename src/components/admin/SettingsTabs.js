// src/components/admin/SettingsTabs.js
"use client";

import { useState } from "react";
import GeneralSettingsForm from "@/components/admin/settings/GeneralSettingsForm";
import ShippingSettingsForm from "@/components/admin/settings/ShippingSettingsForm";
import PaymentSettingsForm from "@/components/admin/settings/PaymentSettingsForm";
import SocialSettingsForm from "@/components/admin/settings/SocialSettingsForm";
import MaintenanceSettingsForm from "@/components/admin/settings/MaintenanceSettingsForm";

export default function SettingsTabs({ settings }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "Të Përgjithshme", icon: "🏪" },
    { id: "shipping", label: "Shipping & Tax", icon: "📦" },
    { id: "payment", label: "Pagesat", icon: "💳" },
    { id: "social", label: "Social Media", icon: "📱" },
    { id: "maintenance", label: "Mirëmbajtje", icon: "🔧" },
  ];

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "general" && <GeneralSettingsForm settings={settings} />}
        {activeTab === "shipping" && (
          <ShippingSettingsForm settings={settings} />
        )}
        {activeTab === "payment" && <PaymentSettingsForm settings={settings} />}
        {activeTab === "social" && <SocialSettingsForm settings={settings} />}
        {activeTab === "maintenance" && (
          <MaintenanceSettingsForm settings={settings} />
        )}
      </div>
    </div>
  );
}
