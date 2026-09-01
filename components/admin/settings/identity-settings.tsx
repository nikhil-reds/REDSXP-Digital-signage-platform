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
  TextInput,
} from "@/components/ui";

export default function IdentitySettings() {
  const [platformName, setPlatformName] = useState("Rubenius");
  const [supportEmail, setSupportEmail] = useState("support@rubenius.com");
  const [supportUrl, setSupportUrl] = useState("https://help.rubenius.com");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [language, setLanguage] = useState("English (India)");
  const [currency, setCurrency] = useState("INR (₹)");

  return (
    <Card size="panel">
      <CardHeader>
        <CardHeading
          size="panel"
          title="Platform Identity"
          description="Core platform naming and regional defaults"
        />
        <CardActions>
          <Badge tone="accent">Saved</Badge>
        </CardActions>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="set-name">Platform Name</FieldLabel>
            <TextInput
              id="set-name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="set-email">Support Email</FieldLabel>
            <TextInput
              id="set-email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="set-url">Support URL</FieldLabel>
            <TextInput
              id="set-url"
              value={supportUrl}
              onChange={(e) => setSupportUrl(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="set-tz">Default Timezone</FieldLabel>
            <Select id="set-tz" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="EST">EST</option>
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="set-lang">Default Language</FieldLabel>
            <Select id="set-lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="English (India)">English (India)</option>
              <option value="English (US)">English (US)</option>
              <option value="Spanish">Spanish</option>
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="set-cur">Default Currency</FieldLabel>
            <Select id="set-cur" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
            </Select>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
