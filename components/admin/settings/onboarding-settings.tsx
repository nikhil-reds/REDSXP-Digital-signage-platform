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

export default function OnboardingSettings() {
  const [trialDuration, setTrialDuration] = useState("14 days");
  const [template, setTemplate] = useState("Welcome Email (v3)");
  const [allowExtension, setAllowExtension] = useState(true);
  const [maxExtensions, setMaxExtensions] = useState("1");
  const [autoSuspend, setAutoSuspend] = useState(true);
  const [gracePeriod, setGracePeriod] = useState("3 days");

  return (
    <Card size="panel">
      <CardHeader>
        <CardHeading
          size="panel"
          title="Trial &amp; Onboarding"
          description="Trial lifecycle and onboarding automation"
        />
        <CardActions>
          <Badge tone="accent">Saved</Badge>
        </CardActions>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="ob-trial">Default Trial Duration</FieldLabel>
            <TextInput
              id="ob-trial"
              value={trialDuration}
              onChange={(e) => setTrialDuration(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="ob-template">Welcome Email Template</FieldLabel>
            <Select id="ob-template" value={template} onChange={(e) => setTemplate(e.target.value)}>
              <option value="Welcome Email (v3)">Welcome Email (v3)</option>
              <option value="Welcome Email (v2)">Welcome Email (v2)</option>
            </Select>
          </div>

          <Switch
            checked={allowExtension}
            onChange={setAllowExtension}
            label="Trial Extension Allowed"
            description="Allow admins to extend trials"
          />

          <div>
            <FieldLabel htmlFor="ob-max">Max Trial Extensions</FieldLabel>
            <TextInput
              id="ob-max"
              value={maxExtensions}
              onChange={(e) => setMaxExtensions(e.target.value)}
            />
          </div>

          <Switch
            checked={autoSuspend}
            onChange={setAutoSuspend}
            label="Auto-suspend on Trial Expiry"
            description="Suspend access when trial ends"
          />

          <div>
            <FieldLabel htmlFor="ob-grace">Grace Period after Expiry</FieldLabel>
            <TextInput
              id="ob-grace"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
