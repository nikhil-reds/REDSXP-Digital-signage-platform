"use client";

// TEMPORARY verification harness for the UI primitives (phase 3a).
// Delete once the card system is signed off.
import React, { useState } from "react";
import {
  Monitor,
  ShieldAlert,
  Play,
  Clock,
  Database,
  Inbox,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardHeading,
  Drawer,
  EmptyState,
  FieldLabel,
  IconButton,
  Modal,
  PageShell,
  ProgressBar,
  SearchInput,
  SectionHeader,
  Select,
  StatGrid,
  StatTile,
  StatusDot,
  TableCard,
  Td,
  TextInput,
  Th,
  Toolbar,
  Tr,
} from "@/components/ui";

export default function CardGalleryPage() {
  // ?modal=1 / ?drawer=1 render the overlays at first paint so they can be
  // measured by the automated audit (a hidden browser pane does no layout for
  // content mounted after load).
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const [modalOpen, setModalOpen] = useState(params?.get("modal") === "1");
  const [drawerOpen, setDrawerOpen] = useState(params?.get("drawer") === "1");
  const [selected, setSelected] = useState(true);

  return (
    <div className="agent-portal min-h-screen bg-app-canvas text-app-text font-sans">
      <PageShell>
        <SectionHeader
          title="Card system gallery"
          description="Every primitive, every state. Verified in both themes."
          actions={
            <>
              <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>
                Open drawer
              </Button>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
                Open modal
              </Button>
            </>
          }
        />

        {/* ---- Stat tiles ---- */}
        <SectionHeader title="Stat tiles" description="Neutral chips by default; functional tone only for real error and warning states." />
        <StatGrid columns={5}>
          <StatTile label="Assigned Screens" value="48" icon={Monitor}>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <StatusDot status="online" label="44 Online" />
              <StatusDot status="warning" label="2 Delayed" />
              <StatusDot status="error" label="2 Offline" />
            </div>
          </StatTile>
          <StatTile label="Active Alerts" value="6" icon={ShieldAlert} tone="danger">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <StatusDot status="error" label="1 Critical" />
              <StatusDot status="warning" label="2 High" />
              <StatusDot status="unknown" label="3 Med/Low" />
            </div>
          </StatTile>
          <StatTile
            label="Loop Plays Today"
            value="18,426"
            icon={Play}
            trend={{ direction: "up", value: "+14.2% vs yesterday" }}
          />
          <StatTile label="Average Uptime" value="98.7%" icon={Clock}>
            <span className="text-caption text-app-muted">Past 30 days · SLA 99.0%</span>
          </StatTile>
          <StatTile label="Storage Used" value="112 GB" icon={Database}>
            <ProgressBar value={112} max={250} label="44.8% of 250 GB limit" />
          </StatTile>
        </StatGrid>

        {/* ---- Card sizes ---- */}
        <SectionHeader title="Card sizes" description="Panel, widget, row — and nothing else." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card size="panel">
            <CardHeader divided>
              <CardHeading size="panel" title="Panel" description="Page-level section" icon={Monitor} />
              <CardActions>
                <IconButton icon={Trash2} aria-label="Delete" size="sm" />
              </CardActions>
            </CardHeader>
            <CardBody>
              <p className="text-body text-app-muted">
                Title is Sora Semibold 24/32. Resting cards carry no shadow — the border separates them.
              </p>
            </CardBody>
            <CardFooter>
              <span className="text-caption text-app-muted">Updated just now</span>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card size="widget" padded>
            <CardHeading size="widget" title="Widget" description="Grid item" />
            <p className="text-body text-app-muted mt-3">Title is Sora Semibold 20/26.</p>
          </Card>

          <div className="space-y-2">
            <Card size="row" padded>
              <CardHeading size="row" title="Row — resting" />
            </Card>
            <Card size="row" padded interactive>
              <CardHeading size="row" title="Row — interactive (hover me)" />
            </Card>
            <Card
              size="row"
              padded
              interactive
              selected={selected}
              onClick={() => setSelected((s) => !s)}
              className="pl-5"
            >
              <CardHeading size="row" title="Row — selected (click to toggle)" />
            </Card>
            <Card size="row" padded disabled>
              <CardHeading size="row" title="Row — disabled" />
            </Card>
          </div>
        </div>

        {/* ---- Badges ---- */}
        <SectionHeader title="Badges & status" description="One vocabulary: accent = healthy, amber = warning, red = error, neutral = unknown." />
        <Card size="panel" padded>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="accent" variant="filled">Filled accent</Badge>
            <Badge tone="danger" variant="filled">6</Badge>
            <Badge tone="warning" variant="filled">Warning</Badge>
            <Badge tone="neutral" variant="outline">Outline</Badge>
            <Badge tone="accent" uppercase>CCD-BLR</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <StatusDot status="online" label="Online" pulse />
            <StatusDot status="warning" label="Degraded" />
            <StatusDot status="error" label="Offline" />
            <StatusDot status="unknown" label="Unknown" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
            <ProgressBar value={72} label="Accent 72%" />
            <ProgressBar value={45} tone="warning" label="Warning 45%" />
            <ProgressBar value={92} tone="danger" label="Danger 92%" />
            <ProgressBar value={30} tone="neutral" label="Neutral 30%" />
          </div>
        </Card>

        {/* ---- Buttons & controls ---- */}
        <SectionHeader title="Buttons & form controls" />
        <Card size="panel" padded>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" size="sm">Small</Button>
          </div>
          <Toolbar className="mt-4">
            <SearchInput placeholder="Search screens, groups, playlists…" className="w-72" />
            <Select defaultValue="all">
              <option value="all">All regions</option>
              <option value="blr">Bengaluru</option>
            </Select>
            <Button size="sm" icon={Plus} variant="primary">New</Button>
          </Toolbar>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-w-xl">
            <div>
              <FieldLabel htmlFor="g-name">Screen name</FieldLabel>
              <TextInput id="g-name" placeholder="Phoenix Mall — Atrium" />
            </div>
            <div>
              <FieldLabel htmlFor="g-loc">Location</FieldLabel>
              <TextInput id="g-loc" placeholder="Bengaluru" />
            </div>
          </div>
        </Card>

        {/* ---- Table card ---- */}
        <SectionHeader title="Table card" />
        <TableCard
          title="Screens & Players"
          description="Flush body, padded header and footer."
          icon={Monitor}
          actions={<Button size="sm" variant="secondary">Export</Button>}
          footer={
            <>
              <span className="text-caption text-app-muted">Showing 3 of 48</span>
              <Button size="sm" variant="secondary">Next</Button>
            </>
          }
        >
          <table className="w-full">
            <thead>
              <tr>
                <Th>Screen</Th>
                <Th>Status</Th>
                <Th>Uptime</Th>
                <Th>Playlist</Th>
              </tr>
            </thead>
            <tbody>
              <Tr interactive>
                <Td>Phoenix Mall — Atrium</Td>
                <Td><StatusDot status="online" label="Online" /></Td>
                <Td>98.7%</Td>
                <Td>Festive Loop A</Td>
              </Tr>
              <Tr interactive>
                <Td>Orion Mall — Food Court</Td>
                <Td><StatusDot status="warning" label="Delayed" /></Td>
                <Td>94.1%</Td>
                <Td>Festive Loop B</Td>
              </Tr>
              <Tr interactive selected>
                <Td>UB City — Lobby</Td>
                <Td><StatusDot status="error" label="Offline" /></Td>
                <Td>61.0%</Td>
                <Td>—</Td>
              </Tr>
            </tbody>
          </table>
        </TableCard>

        {/* ---- Empty state ---- */}
        <SectionHeader title="Empty state" />
        <Card size="panel">
          <EmptyState
            icon={Inbox}
            title="No reports yet"
            description="Generated reports appear here. Create one to get started."
            action={<Button variant="primary" size="sm" icon={Plus}>New report</Button>}
          />
        </Card>
      </PageShell>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create screen group"
        description="Groups let you schedule content across many screens at once."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Create group</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="m-name">Group name</FieldLabel>
            <TextInput id="m-name" placeholder="Bengaluru — Malls" />
          </div>
          <div>
            <FieldLabel htmlFor="m-region">Region</FieldLabel>
            <Select id="m-region" className="w-full">
              <option>Bengaluru</option>
              <option>Mumbai</option>
            </Select>
          </div>
        </div>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Phoenix Mall — Atrium"
        description="Screen detail"
        footer={<Button variant="secondary" onClick={() => setDrawerOpen(false)}>Close</Button>}
      >
        <div className="space-y-4">
          <Card size="row" padded>
            <CardHeading size="row" title="Status" />
            <div className="mt-2"><StatusDot status="online" label="Online · 98.7% uptime" /></div>
          </Card>
          <Card size="row" padded>
            <CardHeading size="row" title="Storage" />
            <ProgressBar value={112} max={250} label="112 GB of 250 GB" className="mt-2" />
          </Card>
        </div>
      </Drawer>
    </div>
  );
}
