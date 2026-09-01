"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardHeading,
  FieldLabel,
  Switch,
  Textarea,
  TextInput,
} from "@/components/ui";

export default function MaintenanceSettings() {
  const [enabled, setEnabled] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [message, setMessage] = useState("We are performing scheduled maintenance....");

  const handleActivate = () => {
    alert("Activating maintenance mode globally...");
  };

  return (
    // Warning-toned panel: maintenance mode takes the platform offline, so the
    // surface itself carries the warning tone rather than just a badge.
    <Card size="panel" className="bg-app-warning-surface border-app-warning/40">
      <CardHeader>
        <CardHeading
          size="panel"
          title="Maintenance Mode"
          description="Temporarily restrict platform access during scheduled work"
        />
        <CardActions>
          <Badge tone="warning" variant="outline">
            Saved
          </Badge>
        </CardActions>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            label="Enable Maintenance Mode"
            description={enabled ? "Currently enabled" : "Currently disabled"}
            className="bg-app-surface"
          />

          <div className="flex flex-col justify-end">
            <FieldLabel htmlFor="mt-ips">Allowed IPs Whitelist</FieldLabel>
            <TextInput
              id="mt-ips"
              placeholder="Admin bypass IPs"
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className="bg-app-surface"
            />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="mt-msg">Maintenance Message</FieldLabel>
          <Textarea
            id="mt-msg"
            placeholder="We are performing scheduled maintenance…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-20 bg-app-surface"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-body font-semibold text-app-warning-text">
            This will display a maintenance page to all tenants and end users.
          </span>

          <Button variant="danger" onClick={handleActivate}>
            Activate Maintenance Mode
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
