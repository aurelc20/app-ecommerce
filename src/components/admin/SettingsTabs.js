// src/components/admin/SettingsTabs.js
"use client";

import { useState } from "react";
import GeneralSettingsForm from "@/components/admin/settings/GeneralSettingsForm";
import ShippingSettingsForm from "@/components/admin/settings/ShippingSettingsForm";
import PaymentSettingsForm from "@/components/admin/settings/PaymentSettingsForm";
import SocialSettingsForm from "@/components/admin/settings/SocialSettingsForm";
import MaintenanceSettingsForm from "@/components/admin/settings/MaintenanceSettingsForm";
import { CreditCard, Package, Smartphone, Store, Wrench } from "lucide-react";

export default function SettingsTabs({ settings }) {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    {
      id: "general",
      label: "Të Përgjithshme",
      icon: <Store className="h-4 w-4" />,
    },
    {
      id: "shipping",
      label: "Shipping & Tax",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "payment",
      label: "Pagesat",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: "social",
      label: "Social Media",
      icon: <Smartphone className="h-4 w-4" />,
    },
    {
      id: "maintenance",
      label: "Mirëmbajtje",
      icon: <Wrench className="h-4 w-4" />,
    },
  ];

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="mb-6 rounded-xl border border-sand bg-paper shadow-sm">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-wood text-wood"
                  : "border-transparent text-ink-soft hover:text-ink"
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
