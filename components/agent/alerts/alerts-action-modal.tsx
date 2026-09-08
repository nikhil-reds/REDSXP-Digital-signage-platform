"use client";

import React, { useState } from "react";
import { AlertTriangle, Cpu, Send } from "lucide-react";
import { Button, FieldLabel, Modal, Select, TextInput } from "@/components/ui";
import { AlertIncident } from "./alerts-stats-banner";

export interface AlertActionData { subject: string; category: string; body: string }

interface AlertsActionModalProps {
  type: "reboot" | "ticket";
  deviceName?: string;
  alert?: AlertIncident | null;
  onClose: () => void;
  onConfirm: (data?: AlertActionData) => void;
}

export default function AlertsActionModal({ type, deviceName, alert, onClose, onConfirm }: AlertsActionModalProps) {
  const [subject, setSubject] = useState(alert ? `[ALERT] - ${alert.issue} on ${alert.deviceName}` : "");
  const [category, setCategory] = useState("Hardware Support");
  const [body, setBody] = useState(alert ? `Active alert detail:\nDevice: ${alert.deviceName}\nGroup: ${alert.groupName}\nSeverity: ${alert.severity}\nTime Started: ${alert.startTime}\nDuration: ${alert.duration}` : "");

  const handleTicketSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onConfirm({ subject, category, body });
  };

  if (type === "reboot") {
    return (
      <Modal
        open
        onClose={onClose}
        title="Reboot device player"
        description="Send a remote restart command to the selected player."
        size="sm"
        footer={<><Button size="sm" onClick={onClose}>Cancel</Button><Button size="sm" variant="danger" onClick={() => onConfirm()}>Send reboot command</Button></>}
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-app-border bg-app-danger-surface text-app-danger-text"><Cpu className="h-6 w-6" /></div>
          <div><p className="text-body font-semibold text-app-text">Confirm remote reboot for “{deviceName}”?</p><p className="mt-1 text-body text-app-muted">The display may go black for approximately 45-60 seconds.</p></div>
          <div className="flex gap-2 rounded-lg border border-app-warning/30 bg-app-warning-surface p-3 text-left text-caption text-app-warning-text"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>Do not reboot during an active sales cycle unless the player heartbeat is offline.</span></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title="Create support ticket" description="File this incident with IT operations." size="md">
      <form onSubmit={handleTicketSubmit} className="space-y-4">
        <div><FieldLabel htmlFor="alert-ticket-subject">Ticket subject</FieldLabel><TextInput id="alert-ticket-subject" value={subject} onChange={(event) => setSubject(event.target.value)} required /></div>
        <div><FieldLabel htmlFor="alert-ticket-category">Support category</FieldLabel><Select id="alert-ticket-category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="Hardware Support">Hardware and player diagnostics</option><option value="Network Support">Network outages and sync lag</option><option value="Content Support">Content syncing and playlist errors</option><option value="General Support">General maintenance support</option></Select></div>
        <div><FieldLabel htmlFor="alert-ticket-body">Details and description</FieldLabel><textarea id="alert-ticket-body" value={body} onChange={(event) => setBody(event.target.value)} rows={5} className="w-full rounded-lg border border-app-border bg-app-surface-alt px-3 py-2 text-body text-app-text focus:outline-none focus:ring-2 focus:ring-app-accent-text" required /></div>
        <div className="flex justify-end gap-2 border-t border-app-border pt-4"><Button size="sm" type="button" onClick={onClose}>Discard</Button><Button size="sm" type="submit" variant="primary" icon={Send}>Submit ticket</Button></div>
      </form>
    </Modal>
  );
}
