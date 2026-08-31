"use client";

import React from "react";
import { AlertTriangle, Building2, Cloud, Globe, Monitor, TrendingUp, UserMinus, Wifi } from "lucide-react";
import { StatGrid, StatTile } from "@/components/ui";

export default function StatsGrid() {
  return <StatGrid columns={4}>
    <StatTile label="MRR" value="₹18,42,600" icon={TrendingUp} trend={{ direction: "up", value: "12.8% vs previous" }} />
    <StatTile label="ARR" value="₹2,21,11,200" icon={Globe}><span className="text-caption text-app-muted">Annual run rate</span></StatTile>
    <StatTile label="Active tenants" value="186" icon={Building2} trend={{ direction: "up", value: "14 this month" }} />
    <StatTile label="Total screens" value="4,862" icon={Monitor}><span className="text-caption text-app-muted">Across all tenants</span></StatTile>
    <StatTile label="Online screens" value="4,517" icon={Wifi} tone="accent"><span className="text-caption text-app-muted">92.9% online rate</span></StatTile>
    <StatTile label="Churn" value="1.8%" icon={UserMinus} trend={{ direction: "down", value: "0.4 percentage points", positive: true }} />
    <StatTile label="Failed payments" value="7" icon={AlertTriangle} tone="danger"><span className="text-caption text-app-danger-text">₹1,26,470 at risk</span></StatTile>
    <StatTile label="CDN bandwidth cost" value="₹7,84,300" icon={Cloud}><span className="text-caption text-app-muted">126 TB transferred</span></StatTile>
  </StatGrid>;
}
