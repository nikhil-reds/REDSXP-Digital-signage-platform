import type { ScheduleSummary } from './api';
export function scheduleLanes(schedules: ScheduleSummary[]) {
  const minutes = (time: string) => { const [h,m]=time.split(':').map(Number); return h*60+m; };
  const ends:number[]=[];
  const entries=[...schedules].sort((a,b)=>minutes(a.dailyStartTime)-minutes(b.dailyStartTime)).map(schedule=>{
    const start=minutes(schedule.dailyStartTime);
    const end=Math.max(minutes(schedule.dailyEndTime),start+66);
    let lane=ends.findIndex(value=>value<=start);
    if(lane<0) lane=ends.length;
    ends[lane]=end;
    return {schedule,lane,top:start/1440*960,height:Math.max(44,(end-start)/1440*960)};
  });
  return {entries,count:Math.max(1,ends.length)};
}
