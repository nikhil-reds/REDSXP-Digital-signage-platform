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
        <h2 className="text-body font-bold text-app-text">Plan Comparison</h2>
        <span className="text-[10px] font-medium text-app-muted">
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
              className={`relative flex flex-col justify-between rounded-xl border bg-app-surface p-4.5 transition-all hover:shadow-sm ${
                plan.isPopular
                  ? "border-app-accent-border ring-1 ring-app-accent-border"
                  : "border-app-border"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-2.5 right-6 rounded-full bg-app-accent px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-app-accent-on shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                {/* Plan Title & Price */}
                <div>
                  <h3 className="text-caption font-bold uppercase tracking-wider text-app-muted">
                    {plan.name}
                  </h3>
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-xl font-bold tracking-tight text-app-text">
                      {plan.price}
                    </span>
                    {!isEnterprise && (
                      <span className="text-[10px] font-medium text-app-muted">/mo</span>
                    )}
                  </div>
                </div>

                {/* Monthly/Annual Toggle Selector */}
                {!isEnterprise ? (
                  <div className="mt-3.5 flex select-none rounded-lg bg-app-surface-alt p-0.5 text-[10px] font-semibold text-app-muted">
                    <button
                      onClick={() => setBillingCycles({ ...billingCycles, [plan.name]: "monthly" })}
                      className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                        cycle === "monthly"
                          ? "bg-app-surface text-app-text shadow-xs"
                          : "text-app-muted hover:text-app-text"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycles({ ...billingCycles, [plan.name]: "annual" })}
                      className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${
                        cycle === "annual"
                          ? "bg-app-surface text-app-text shadow-xs"
                          : "text-app-muted hover:text-app-text"
                      }`}
                    >
                      Annual
                    </button>
                  </div>
                ) : (
                  <button className="mt-3.5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-app-border py-1.5 text-[10px] font-semibold text-app-text shadow-xs transition-colors hover:bg-app-surface-alt">
                    <PhoneCall className="w-3 h-3 text-zinc-500" />
                    <span>Contact Sales</span>
                  </button>
                )}

                {/* Param details grid */}
                <div className="mt-5 space-y-2 text-xs">
                  {plan.params.map((param) => (
                    <div key={param.label} className="flex items-center justify-between text-app-muted">
                      <span>{param.label}</span>
                      <span className={param.isBold ? "font-bold text-app-text" : "font-medium text-app-text"}>
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4 border-app-border" />

                {/* Features toggles list */}
                <div className="space-y-3.5 text-xs">
                  {plan.features.map((feature, idx) => (
                    <div key={feature.label} className="flex items-center justify-between text-app-muted">
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
                        <div className="peer h-4 w-7 rounded-full bg-app-border after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:border after:border-app-border after:bg-app-surface after:transition-all after:content-[''] peer-checked:bg-app-accent peer-checked:after:translate-x-full peer-focus:outline-none" />
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
