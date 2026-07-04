"use client";

import React, { useState } from "react";
import { PhoneCall } from "lucide-react";

interface PlanParam {
  label: string;
  value: string;
  isBold?: boolean;
}

interface PlanFeature {
  label: string;
  checked: boolean;
}

interface Plan {
  name: string;
  price: string;
  isCustom?: boolean;
  isPopular?: boolean;
  params: PlanParam[];
  features: PlanFeature[];
}

export default function PlanCards() {
  const [billingCycles, setBillingCycles] = useState<Record<string, "monthly" | "annual">>({
    Starter: "monthly",
    Growth: "monthly",
    Business: "monthly",
    Enterprise: "monthly"
  });

  const [featuresState, setFeaturesState] = useState<Record<string, boolean[]>>({
    Starter: [false, false, false, false, false],
    Growth: [true, false, true, true, false],
    Business: [true, true, true, false, true],
    Enterprise: [true, true, true, true, true]
  });

  const handleToggleFeature = (planName: string, featureIdx: number) => {
    if (planName === "Enterprise") return; // Keep Enterprise fully toggled on as read-only mockup
    const current = [...featuresState[planName]];
    current[featureIdx] = !current[featureIdx];
    setFeaturesState({ ...featuresState, [planName]: current });
  };

  const plans: Plan[] = [
    {
      name: "Starter",
      price: "₹4,999",
      params: [
        { label: "Screens", value: "5" },
        { label: "Storage", value: "50 GB" },
        { label: "Seats", value: "2" },
        { label: "Sensor rules", value: "0" },
        { label: "Analytics retention", value: "30d" }
      ],
      features: [
        { label: "Custom Branding", checked: featuresState.Starter[0] },
        { label: "Custom Domain", checked: featuresState.Starter[1] },
        { label: "API Access", checked: featuresState.Starter[2] },
        { label: "Proof-of-Play Export", checked: featuresState.Starter[3] },
        { label: "Priority Support", checked: featuresState.Starter[4] }
      ]
    },
    {
      name: "Growth",
      price: "₹12,999",
      params: [
        { label: "Screens", value: "25" },
        { label: "Storage", value: "250 GB" },
        { label: "Seats", value: "5" },
        { label: "Sensor rules", value: "5" },
        { label: "Analytics retention", value: "90d" }
      ],
      features: [
        { label: "Custom Branding", checked: featuresState.Growth[0] },
        { label: "Custom Domain", checked: featuresState.Growth[1] },
        { label: "API Access", checked: featuresState.Growth[2] },
        { label: "Proof-of-Play Export", checked: featuresState.Growth[3] },
        { label: "Priority Support", checked: featuresState.Growth[4] }
      ]
    },
    {
      name: "Business",
      price: "₹29,999",
      params: [
        { label: "Screens", value: "100" },
        { label: "Storage", value: "2 TB" },
        { label: "Seats", value: "15" },
        { label: "Sensor rules", value: "25" },
        { label: "Analytics retention", value: "1yr" }
      ],
      features: [
        { label: "Custom Branding", checked: featuresState.Business[0] },
        { label: "Custom Domain", checked: featuresState.Business[1] },
        { label: "API Access", checked: featuresState.Business[2] },
        { label: "Proof-of-Play Export", checked: featuresState.Business[3] },
        { label: "Priority Support", checked: featuresState.Business[4] }
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      isCustom: true,
      isPopular: true,
      params: [
        { label: "Screens", value: "Unlimited", isBold: true },
        { label: "Storage", value: "Custom", isBold: true },
        { label: "Seats", value: "Unlimited", isBold: true },
        { label: "Sensor rules", value: "Unlimited", isBold: true },
        { label: "Analytics retention", value: "3yr", isBold: true }
      ],
      features: [
        { label: "Custom Branding", checked: featuresState.Enterprise[0] },
        { label: "Custom Domain", checked: featuresState.Enterprise[1] },
        { label: "API Access", checked: featuresState.Enterprise[2] },
        { label: "Proof-of-Play Export", checked: featuresState.Enterprise[3] },
        { label: "Priority Support", checked: featuresState.Enterprise[4] }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Small Header */}
      <div className="flex justify-between items-baseline">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Plan Comparison</h2>
        <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
          Prices in INR · GST exclusive
        </span>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isEnterprise = plan.isCustom;
          const cycle = billingCycles[plan.name] || "monthly";

          return (
            <div
              key={plan.name}
              className={`bg-white dark:bg-zinc-900 border p-4.5 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all relative ${
                plan.isPopular
                  ? "border-zinc-950 dark:border-zinc-100 ring-1 ring-zinc-950 dark:ring-zinc-100"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-2.5 right-6 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                {/* Plan Title & Price */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {plan.name}
                  </h3>
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                      {plan.price}
                    </span>
                    {!isEnterprise && (
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">/mo</span>
                    )}
                  </div>
                </div>

                {/* Monthly/Annual Toggle Selector */}
                {!isEnterprise ? (
                  <div className="mt-3.5 p-0.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg flex text-[10px] font-semibold text-zinc-505 select-none">
                    <button
                      onClick={() => setBillingCycles({ ...billingCycles, [plan.name]: "monthly" })}
                      className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                        cycle === "monthly"
                          ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                          : "text-zinc-500 dark:text-zinc-450 hover:text-zinc-800"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycles({ ...billingCycles, [plan.name]: "annual" })}
                      className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                        cycle === "annual"
                          ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs"
                          : "text-zinc-500 dark:text-zinc-450 hover:text-zinc-800"
                      }`}
                    >
                      Annual
                    </button>
                  </div>
                ) : (
                  <button className="mt-3.5 w-full py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-xs cursor-pointer">
                    <PhoneCall className="w-3 h-3 text-zinc-500" />
                    <span>Contact Sales</span>
                  </button>
                )}

                {/* Param details grid */}
                <div className="mt-5 space-y-2 text-xs">
                  {plan.params.map((param) => (
                    <div key={param.label} className="flex justify-between items-center text-zinc-650 dark:text-zinc-450">
                      <span>{param.label}</span>
                      <span className={param.isBold ? "font-bold text-zinc-900 dark:text-zinc-50" : "font-medium"}>
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800 my-4" />

                {/* Features toggles list */}
                <div className="space-y-3.5 text-xs">
                  {plan.features.map((feature, idx) => (
                    <div key={feature.label} className="flex justify-between items-center text-zinc-600 dark:text-zinc-400">
                      <span>{feature.label}</span>
                      {/* Custom Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feature.checked}
                          disabled={isEnterprise}
                          onChange={() => handleToggleFeature(plan.name, idx)}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-zinc-600 peer-checked:bg-zinc-950 dark:peer-checked:bg-zinc-100" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
