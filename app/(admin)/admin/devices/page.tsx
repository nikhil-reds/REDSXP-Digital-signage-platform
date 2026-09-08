"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import DevicesList from "@/components/admin/devices/devices-list";
import DeviceDetail from "@/components/admin/devices/device-detail";
import { Button } from "@/components/ui";

interface Device {
  id: string;
  name: string;
  tenant: string;
  serial: string;
  model: string;
  status: "Online" | "Delayed" | "Offline";
  location: string;
}

const initialDevices: Device[] = [
  {
    id: "1",
    name: "Bengaluru Koramangala Entrance",
    tenant: "Café Coffee Day",
    serial: "CCD-BLR-1035",
    model: "XD1035",
    status: "Online",
    location: "Bengaluru, KA"
  },
  {
    id: "2",
    name: "Mumbai Phoenix Mall Screen 04",
    tenant: "Reliance Retail Media",
    serial: "RRM-MUM-4055",
    model: "XC4055",
    status: "Online",
    location: "Mumbai, MH"
  },
  {
    id: "3",
    name: "Delhi Saket Audi 3 Lobby",
    tenant: "PVR INOX",
    serial: "PVR-DEL-1144",
    model: "XT1144",
    status: "Delayed",
    location: "Delhi, DL"
  },
  {
    id: "4",
    name: "Hyderabad Jubilee Hills Pharmacy",
    tenant: "Apollo Pharmacies",
    serial: "APL-HYD-0425",
    model: "LS425",
    status: "Offline",
    location: "Hyderabad Jubilee Hills"
  }
];

export default function DevicesInventoryPage() {
  const [devices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(initialDevices[3]); // Select Hyderabad pharmacy by default as in the screenshot

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-app-canvas font-sans text-app-text">
      {/* Main content view */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-page-title font-bold tracking-tight text-app-text">
              Device Inventory
            </h1>
            <p className="text-caption text-app-muted">
              4,862 total · 4,517 online · 96 delayed · 249 offline
            </p>
          </div>
          <Button className="self-start sm:self-auto">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Devices list component */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          <DevicesList
            devices={devices}
            selectedDeviceId={selectedDevice?.id || null}
            onSelectDevice={(dev) => setSelectedDevice(dev)}
          />
        </div>
      </div>

      {/* Slide-out Device detail sheet */}
      {selectedDevice && (
        <DeviceDetail
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </div>
  );
}
