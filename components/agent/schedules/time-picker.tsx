"use client";
import { useId } from 'react';
export default function TimePicker({value,onChange,label}:{value:string;onChange:(value:string)=>void;label?:string}) {
  const id=useId();
  return <div className="flex flex-col gap-1.5 min-w-0"><label htmlFor={id} className="text-caption font-semibold text-app-muted">{label??'Time'}</label><input id={id} type="time" required value={value} onChange={event=>onChange(event.target.value)} className="w-full min-w-0 rounded-lg border border-app-border bg-app-surface-alt p-3 text-app-text"/></div>;
}
