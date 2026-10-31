"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
export function useOverviewResource<T>(loader:()=>Promise<T>) {
 const [data,setData]=useState<T|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [updated,setUpdated]=useState<Date|null>(null);
 const generation=useRef(0);
 const refresh=useCallback(async()=>{
  const request=++generation.current;setLoading(true);setError('');
  try { const result=await loader();if(request===generation.current){setData(result);setUpdated(new Date());} }
  catch {if(request===generation.current)setError('Unable to refresh this section. Please try again.');}
  finally {if(request===generation.current)setLoading(false);}
 },[loader]);
 useEffect(()=>{
  const requests=generation;
  // Start the initial request with the same loading state used for manual refresh.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void refresh();return()=>{requests.current++;};
 },[refresh]);
 return {data,loading,error,updated,refresh};
}
