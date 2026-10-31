import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { addMonths, toISODate } from '../components/agent/schedules/date-utils';
import { scheduleLanes } from '../components/agent/schedules/calendar-layout';
import type { ScheduleSummary } from '../components/agent/schedules/api';
const entry=(id:string,start:string,end:string)=>({id,dailyStartTime:start,dailyEndTime:end} as ScheduleSummary);
test('month navigation clamps end-of-month dates without skipping February',()=>{
 assert.equal(toISODate(addMonths(new Date(2026,0,31),1)),'2026-02-28');
 assert.equal(toISODate(addMonths(new Date(2024,2,31),-1)),'2024-02-29');
});
test('overlapping and visually short events have separate selectable lanes',()=>{
 const layout=scheduleLanes([entry('a','09:00','10:00'),entry('b','09:30','11:00'),entry('c','12:00','12:01')]);
 assert.equal(layout.count,2);assert.notEqual(layout.entries[0].lane,layout.entries[1].lane);assert.equal(layout.entries[2].lane,0);assert.ok(layout.entries.every(item=>item.height>=44));
});
