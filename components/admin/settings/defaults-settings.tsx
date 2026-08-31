"use client";

import React, { useState } from "react";
import {
  Badge,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardHeading,
  FieldLabel,
  Select,
  Switch,
  TextInput,
} from "@/components/ui";

export default function DefaultsSettings() {
  const [defaultPlan, setDefaultPlan] = useState("Starter");
  const [maxScreens, setMaxScreens] = useState("5");
  const [maxStorage, setMaxStorage] = useState("50 GB");
  const [allowUpgrade, setAllowUpgrade] = useState(true);
  const [allowDowngrade, setAllowDowngrade] = useState(false);
  const [requireVerification, setRequireVerification] = useState(true);

  return (
    <Card size="panel">
      <CardHeader>
        <CardHeading
          size="panel"
          title="Tenant Defaults"
          description="Default provisioning settings for new tenants"
        />
        <CardActions>
          <Badge tone="accent">Saved</Badge>
        </CardActions>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="df-plan">Default Plan on Signup</FieldLabel>
            <Select id="df-plan" value={defaultPlan} onChange={(e) => setDefaultPlan(e.target.value)}>
              <option value="Starter">Starter</option>
              <option value="Growth">Growth</option>
              <option value="Business">Business</option>
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="df-screens">Max Screens per Tenant</FieldLabel>
            <TextInput
              id="df-screens"
              value={maxScreens}
              onChange={(e) => setMaxScreens(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="df-storage">Max Storage per Tenant</FieldLabel>
            <TextInput
              id="df-storage"
              value={maxStorage}
              onChange={(e) => setMaxStorage(e.target.value)}
            />
          </div>

          <Switch
            checked={allowUpgrade}
            onChange={setAllowUpgrade}
            label="Allow Tenant Self-service Upgrade"
            description="Tenants can upgrade plans without approval"
          />

          <Switch
            checked={allowDowngrade}
            onChange={setAllowDowngrade}
            label="Allow Tenant Self-service Downgrade"
            description="Requires admin approval"
          />

          <Switch
            checked={requireVerification}
            onChange={setRequireVerification}
            label="Require Domain Verification"
            description="Verify custom domains before activation"
          />
        </div>
      </CardBody>
    </Card>
  );
}
