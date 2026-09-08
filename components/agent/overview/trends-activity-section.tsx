"use client";

import React from "react";
import dynamic from "next/dynamic";
import { User, Shield, Terminal, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  SkeletonChart,
} from "@/components/ui";

// Recharts measures the DOM, so the charts are client-only. Loading them this
// way removes the previous `mounted` state flag and its setState-in-effect.
const OverviewCharts = dynamic(() => import("./overview-charts"), {
  ssr: false,
  loading: () => (
    <>
      <SkeletonChart className="h-80" label="Loading trend chart…" />
      <SkeletonChart className="h-80" label="Loading activity chart…" />
    </>
  ),
});

const activityFeed = [
  {
    id: "act-1",
    agent: "Aarav Mehta",
    action: "Published playlist",
    target: "Monsoon Café Promotions to 21 screens",
    time: "3:42 PM",
    icon: User,
  },
  {
    id: "act-2",
    agent: "Aarav Mehta",
    action: "Restarted player",
    target: "MG Road Menu Board 01 — Successful",
    time: "3:18 PM",
    icon: User,
  },
  {
    id: "act-3",
    agent: "Sneha Iyer",
    action: "Acknowledged warning",
    target: "Phoenix Marketcity Storage warning (94%)",
    time: "2:56 PM",
    icon: Shield,
  },
  {
    id: "act-4",
    agent: "System Deployer",
    action: "Pushed manifest",
    target: "mf_8f21c to Bengaluru Flagship Stores",
    time: "2:40 PM",
    icon: Terminal,
  },
  {
    id: "act-5",
    agent: "Rohan Das",
    action: "Updated priority",
    target: "Entrance Motion Promotion from 70 to 80",
    time: "1:24 PM",
    icon: User,
  },
];

export default function TrendsActivitySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Charts (Sensor + Proof of play) */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <OverviewCharts />
      </div>

      {/* 2. Recent Activity Feed */}
      <Card size="panel" className="flex flex-col lg:col-span-1">
        <CardHeader>
          <CardHeading
            size="panel"
            title="Recent Activity Feed"
            description="Audit log of regional operator events"
          />
        </CardHeader>

        <CardBody className="flex-1">
          <div className="space-y-4">
            {activityFeed.map((feed) => {
              const Icon = feed.icon;
              return (
                <div key={feed.id} className="flex gap-3">
                  {/* Neutral chip: an audit entry is not an error or a warning */}
                  <span className="rounded-lg shrink-0 w-8 h-8 flex items-center justify-center bg-app-surface-alt text-app-muted">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-body text-app-muted">
                      <span className="font-semibold text-app-text mr-1">{feed.agent}</span>
                      {feed.action}
                    </p>
                    <p className="text-caption font-semibold text-app-accent-text mt-0.5 truncate">
                      {feed.target}
                    </p>
                    <span className="text-caption text-app-muted block mt-0.5">{feed.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>

        <CardFooter>
          <span className="text-caption text-app-muted">Active operators: 3</span>
          <button className="text-body font-semibold text-app-accent-text hover:underline flex items-center gap-0.5 cursor-pointer">
            Full Audit Trail <ArrowUpRight className="w-3 h-3" />
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
