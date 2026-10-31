"use client";
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { RefreshCw, ArrowUpRight, Monitor, CalendarDays, Layers, AlertTriangle, Upload, ListPlus, MapPin, Activity } from 'lucide-react';
import { Button, StatTile, Badge } from '@/components/ui';
import { useSession } from '@/components/providers/session-provider';
import { getSidebarProfile, getTimeGreeting } from '@/lib/sidebar-profile';
import { fetchScreens } from '@/components/agent/screens/api';
import { fetchPlaylists } from '@/components/agent/playlists/api';
import { fetchSchedules } from '@/components/agent/schedules/api';
import { isScheduleActiveOnDate } from '@/components/agent/schedules/date-utils';
import MediaUploadModal from '@/components/agent/media/media-upload-modal';
import { useOverviewResource } from '@/components/agent/overview/use-overview-resource';
import '@/components/agent/overview/overview-responsive.css';
import '@/components/agent/media/media-responsive.css';

function Panel({title,description,children,href,action}:{title:string;description:string;children:ReactNode;href?:string;action?:string}) {
 return <section className="overview-panel"><header><h2>{title}</h2><p>{description}</p></header><div className="overview-panel-body">{children}</div>{href&&<footer><Link href={href}>{action}<ArrowUpRight size={16}/></Link></footer>}</section>;
}
function RequestState({loading,error,hasData,retry}:{loading:boolean;error:string;hasData:boolean;retry:()=>void}) {
 return <>{loading&&!hasData&&<div className="overview-placeholder" role="status">Loading workspace data…</div>}{error&&<div className="overview-error" role="alert"><p>{error}{hasData?' Showing the last successful snapshot.':''}</p><Button size="sm" onClick={retry} disabled={loading}>Retry</Button></div>}</>;
}
export default function AgentPage() {
 const {user,loading:sessionLoading}=useSession();
 const profile=user?getSidebarProfile(user):null;
 const screens=useOverviewResource(fetchScreens);
 const playlists=useOverviewResource(fetchPlaylists);
 const schedules=useOverviewResource(fetchSchedules);
 const [now,setNow]=useState<Date|null>(null);
 const [uploadOpen,setUploadOpen]=useState(false);
 const [uploadMessage,setUploadMessage]=useState('');
 useEffect(()=>{
  // Render browser-local dates after hydration, then keep the day/time current.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setNow(new Date());const timer=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer);
 },[]);
 const refreshing=screens.loading||playlists.loading||schedules.loading;
 const healthy=screens.data?.filter(screen=>screen.status==='Online').length??0;
 const delayed=screens.data?.filter(screen=>screen.status==='Delayed').length??0;
 const offline=screens.data?.filter(screen=>screen.status==='Offline').length??0;
 const attention=screens.data?.filter(screen=>screen.status!=='Online'||screen.alertsCount>0)??[];
 const alertCount=screens.data?.reduce((sum,screen)=>sum+screen.alertsCount,0);
 const todaySchedules=now?schedules.data?.filter(schedule=>schedule.status==='ACTIVE'&&isScheduleActiveOnDate(schedule,now)).sort((a,b)=>a.dailyStartTime.localeCompare(b.dailyStartTime))??[]:[];
 const locations=Array.from(new Set(screens.data?.map(screen=>screen.location.trim()).filter(Boolean)??[]));
 const recent=[...(playlists.data??[])].sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)).slice(0,5);
 const timestamps=[screens.updated,playlists.updated,schedules.updated];
 const updated=timestamps.every(Boolean)&&!screens.error&&!playlists.error&&!schedules.error?new Date(Math.min(...timestamps.map(time=>time!.getTime()))):null;
 const state=(resource:typeof screens|typeof playlists|typeof schedules)=><RequestState loading={resource.loading} error={resource.error} hasData={resource.data!==null} retry={()=>void resource.refresh()}/>;
 const clock=now?`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`:'';
 return <div className="overview-page"><div className="overview-content">
  <header className="overview-header"><div><span className="overview-eyebrow">Workspace overview</span><h1>{sessionLoading||!now?'Welcome':`${getTimeGreeting(now)}, ${profile?.displayName??'there'}`}</h1><p>{profile?.tenantName??'Your workspace'}{screens.data?` · ${locations.length} configured location${locations.length===1?'':'s'}`:''}</p><p className="overview-updated" role="status">{refreshing?'Refreshing workspace…':updated?`Updated ${updated.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}`:'Some workspace data is unavailable'}</p></div><div className="overview-header-actions"><span className="overview-date"><CalendarDays size={16}/>{now?.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})??'Today'}</span><Button size="sm" icon={RefreshCw} disabled={refreshing} onClick={()=>{void screens.refresh();void playlists.refresh();void schedules.refresh();}}>Refresh</Button><Button size="sm" variant="primary" as={Link} href="/agent/schedules">Schedule content</Button></div></header>
  <section className="overview-kpis" aria-label="Workspace metrics">
   <StatTile label="Assigned screens" value={screens.data?.length??'—'} icon={Monitor}><p>{screens.data?`${healthy} online · ${offline} offline`:'Awaiting screen data'}</p></StatTile>
   <StatTile label="Reported alerts" value={alertCount??'—'} icon={AlertTriangle} tone={alertCount?'warning':'neutral'}><p>Reported by assigned screens</p></StatTile>
   <StatTile label="Today’s schedules" value={schedules.data&&now?todaySchedules.length:'—'} icon={CalendarDays}><p>Enabled schedules for today</p></StatTile>
   <StatTile label="Playlists" value={playlists.data?.length??'—'} icon={Layers}><p>Available content collections</p></StatTile>
  </section>
  <div className="overview-operations">
   <Panel title="Needs attention" description="Screens reporting alerts or connection issues" href="/agent/screens" action="Review screens">
    {state(screens)}{screens.data&&!attention.length&&<div className="overview-empty"><Monitor size={28}/><strong>{screens.data.length?'No screen issues reported':'No screens connected yet'}</strong><p>{screens.data.length?'All assigned screens are reporting online with no alerts.':'Add a screen to start monitoring your workspace.'}</p></div>}
    <div className="overview-list">{attention.slice(0,5).map(screen=><Link key={screen.id} href="/agent/screens" className="overview-list-row"><span><strong>{screen.name}</strong><small>{screen.location||'Location not assigned'} · Heartbeat {screen.heartbeat}</small></span><Badge tone={screen.status==='Offline'?'danger':'warning'}>{screen.alertsCount?`${screen.alertsCount} alerts`:screen.status}</Badge></Link>)}</div>
   </Panel>
   <Panel title="Screen health" description="Latest reported connection states" href="/agent/screens" action="View all screens">
    {state(screens)}{screens.data&&<><div className="overview-health-total"><strong>{screens.data.length}</strong><span>assigned screens</span></div><div className="overview-health-bar" role="img" aria-label={`${healthy} online, ${delayed} delayed, ${offline} offline`}>{[{count:healthy,tone:'online'},{count:delayed,tone:'delayed'},{count:offline,tone:'offline'}].map(item=><span key={item.tone} data-tone={item.tone} style={{width:`${screens.data!.length?item.count/screens.data!.length*100:0}%`}}/>)}</div><dl className="overview-health-labels"><div><dt>Online</dt><dd>{healthy}</dd></div><div><dt>Delayed</dt><dd>{delayed}</dd></div><div><dt>Offline</dt><dd>{offline}</dd></div></dl><p className="overview-note">Connection state is reported by the screen service; it is not an uptime percentage.</p></>}
   </Panel>
   <Panel title="Quick actions" description="Keep content and screens up to date">
    <nav className="overview-quick-actions" aria-label="Quick actions"><button onClick={()=>{setUploadMessage('');setUploadOpen(true);}}><Upload size={20}/><span><strong>Upload media</strong><small>Review files before uploading</small></span><ArrowUpRight size={16}/></button><Link href="/agent/playlists/create-playlist"><ListPlus size={20}/><span><strong>Create playlist</strong><small>Build a content loop</small></span><ArrowUpRight size={16}/></Link><Link href="/agent/schedules"><CalendarDays size={20}/><span><strong>Schedule content</strong><small>Choose dates and target screens</small></span><ArrowUpRight size={16}/></Link><Link href="/agent/screens"><Monitor size={20}/><span><strong>Manage screens</strong><small>Review players and assignments</small></span><ArrowUpRight size={16}/></Link></nav>{uploadMessage&&<p role="status" className="overview-note">{uploadMessage}</p>}
   </Panel>
  </div>
  <div className="overview-details">
   <Panel title="Today’s schedule" description={now?`Scheduled windows · ${Intl.DateTimeFormat().resolvedOptions().timeZone}`:'Scheduled windows'} href="/agent/schedules" action="Open scheduler">
    {state(schedules)}{schedules.data&&!todaySchedules.length&&<div className="overview-empty"><CalendarDays size={28}/><strong>No schedules for today</strong><p>Open the scheduler to plan your next content window.</p></div>}
    <div className="overview-timeline">{todaySchedules.slice(0,6).map(schedule=><Link href="/agent/schedules" key={schedule.id}><span className="overview-time">{schedule.dailyStartTime}–{schedule.dailyEndTime}{clock>=schedule.dailyStartTime&&clock<schedule.dailyEndTime&&<Badge tone="accent">Within time window</Badge>}</span><strong>{schedule.name}</strong><small>{schedule.playlistName} · {schedule.screensCount} screens · Priority {schedule.priority}</small></Link>)}</div>{todaySchedules.length>6&&<p className="overview-note">{todaySchedules.length-6} more in the scheduler.</p>}
   </Panel>
   <Panel title="Assigned content" description="Configured playlists, not confirmed live playback" href="/agent/screens" action="Manage assignments">
    {state(screens)}{screens.data&&!screens.data.length&&<p className="overview-note">No screen assignments yet.</p>}<div className="overview-list">{screens.data?.slice(0,6).map(screen=><Link href="/agent/screens" key={screen.id} className="overview-list-row"><span><strong>{screen.name}</strong><small>{screen.content}</small></span><Badge>{screen.status}</Badge></Link>)}</div>{screens.data&&screens.data.length>6&&<p className="overview-note">View all screens for additional assignments.</p>}
   </Panel>
  </div>
  <div className="overview-secondary">
   <Panel title="Recent playlists" description="Most recently updated content collections" href="/agent/playlists" action="View playlists">
    {state(playlists)}{playlists.data&&!recent.length&&<p className="overview-note">Create your first playlist to start building content.</p>}<div className="overview-list">{recent.map(playlist=><Link key={playlist.id} href={`/agent/playlists/create-playlist?id=${encodeURIComponent(playlist.id)}`} className="overview-list-row"><span><strong>{playlist.name}</strong><small>{playlist.itemCount} clips · Updated {new Date(playlist.updatedAt).toLocaleDateString()}</small></span><ArrowUpRight size={16}/></Link>)}</div>
   </Panel>
   <Panel title="Locations" description="Location names configured on your screens" href="/agent/screens" action="Manage locations">
    {state(screens)}{screens.data&&!locations.length&&<div className="overview-empty"><MapPin size={28}/><strong>No locations assigned</strong><p>Add location information to your screens to organize this overview.</p></div>}<div className="overview-list">{locations.slice(0,5).map(location=><Link href="/agent/screens" className="overview-list-row" key={location}><strong>{location}</strong><small>{screens.data?.filter(screen=>screen.location.trim()===location).length} screens</small></Link>)}</div>
   </Panel>
   <Panel title="Performance insights" description="Historical playback and uptime"><div className="overview-empty"><Activity size={28}/><strong>Historical metrics unavailable</strong><p>Verified playback totals, uptime trends, and sensor history are not available to this overview yet.</p></div></Panel>
  </div>
  {uploadOpen&&<MediaUploadModal onClose={()=>setUploadOpen(false)} onUploadSuccess={asset=>setUploadMessage(`${asset.name} added to the media library.`)}/>}
 </div></div>;
}
