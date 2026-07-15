"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPlaylist,
  fetchMediaLibrary,
  fetchPlaylist,
  updatePlaylist,
  type SavePlaylistPayload,
} from "./api";
import {
  CLIP_TYPE_COLORS,
  DEVICE_PROFILES,
  DISPLAY_PRESETS,
  FALLBACK_OPTIONS,
  INITIAL_DEVICE,
  INITIAL_DISPLAY,
  INITIAL_FALLBACK,
  LOCKED_TRACKS,
} from "./constants";
import { aspectRatioLabel, formatDuration, getCompatibility } from "./utils";
import { DisplayConfigTab, DisplayProfile, Fit, LibraryAsset, PlaylistClip, Transition, ViewMode } from "./types";

const PAD = 12;

interface DragState {
  id: string;
  dx: number;
}

interface UsePlaylistEditorOptions {
  playlistId?: string;
}

export function usePlaylistEditor({ playlistId }: UsePlaylistEditorOptions = {}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(playlistId);

  const [libraryAssets, setLibraryAssets] = useState<LibraryAsset[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [items, setItems] = useState<PlaylistClip[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [fallback, setFallback] = useState(INITIAL_FALLBACK);
  const [dirty, setDirty] = useState(false);
  const [zoom, setZoom] = useState(22);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [history, setHistory] = useState<string[]>(() => [JSON.stringify([])]);
  const [histIdx, setHistIdx] = useState(0);
  const [display, setDisplayState] = useState<DisplayProfile>(INITIAL_DISPLAY);
  const [device, setDevice] = useState(INITIAL_DEVICE);
  const [displayConfigOpen, setDisplayConfigOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [configTab, setConfigTab] = useState<DisplayConfigTab>("presets");
  const [customW, setCustomW] = useState(1920);
  const [customH, setCustomH] = useState(1080);
  const [safeTitle, setSafeTitle] = useState(false);
  const [safeAction, setSafeAction] = useState(false);
  const [safeBleed, setSafeBleed] = useState(false);

  const dragCtx = useRef<{ id: string; startX: number } | null>(null);
  const resizeCtx = useRef<{ id: string; startX: number; startDuration: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextInstanceIdRef = useRef(0);
  const genInstanceId = useCallback(() => `clip-${nextInstanceIdRef.current++}`, []);

  // Mirrors of the latest state, read from the stable window pointer listeners below
  // so drag/resize logic always sees fresh values without reattaching listeners mid-gesture.
  const itemsRef = useRef(items);
  const dragRef = useRef<DragState | null>(null);
  const zoomRef = useRef(zoom);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  // Sets items as the new undo baseline (used after an initial load and after a
  // successful save) — resets the history stack rather than pushing onto it.
  const setBaseline = useCallback((nextItems: PlaylistClip[]) => {
    setItems(nextItems);
    setHistory([JSON.stringify(nextItems)]);
    setHistIdx(0);
    setDirty(false);
  }, []);

  // Load the media library, and (if editing) the target playlist, on mount.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const assets = await fetchMediaLibrary();
        if (cancelled) return;
        setLibraryAssets(assets);

        if (playlistId) {
          const detail = await fetchPlaylist(playlistId);
          if (cancelled) return;
          const assetById = new Map(assets.map((a) => [a.id, a]));
          const hydrated: PlaylistClip[] = detail.items.map((item) => {
            const asset = assetById.get(item.mediaId);
            return {
              instanceId: genInstanceId(),
              mediaId: item.mediaId,
              name: asset?.name ?? "Unknown asset",
              type: asset?.type ?? "Image",
              w: asset?.w ?? 0,
              h: asset?.h ?? 0,
              size: asset?.size ?? "—",
              duration: item.durationSec,
              transition: "Fade",
              transDur: 1,
              thumb: asset?.thumb ?? CLIP_TYPE_COLORS.Image,
              src: asset?.src ?? "",
              fit: "Fill",
            };
          });
          setPlaylistName(detail.name);
          setBaseline(hydrated);
          setSelectedId(hydrated[0]?.instanceId ?? null);
        } else {
          setPlaylistName("Untitled Playlist");
          setBaseline([]);
          setSelectedId(null);
        }
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to load playlist data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  // Non-nested: pushHistory truncates any redo-tail and appends one snapshot, so the new
  // index is always histIdx + 1 — computed directly rather than inside a setState updater,
  // which keeps every updater here pure (safe under Strict Mode's double-invoke checks).
  const pushHistory = useCallback(
    (nextItems: PlaylistClip[]) => {
      setHistory((h) => [...h.slice(0, histIdx + 1), JSON.stringify(nextItems)]);
      setHistIdx(histIdx + 1);
    },
    [histIdx]
  );

  const commit = useCallback(
    (nextItems: PlaylistClip[]) => {
      setItems(nextItems);
      setDirty(true);
      pushHistory(nextItems);
    },
    [pushHistory]
  );

  const undo = useCallback(() => {
    if (histIdx <= 0) return;
    setItems(JSON.parse(history[histIdx - 1]));
    setHistIdx(histIdx - 1);
    setDirty(true);
  }, [history, histIdx]);

  const redo = useCallback(() => {
    if (histIdx >= history.length - 1) return;
    setItems(JSON.parse(history[histIdx + 1]));
    setHistIdx(histIdx + 1);
    setDirty(true);
  }, [history, histIdx]);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload: SavePlaylistPayload = {
        name: playlistName,
        items: items.map((it, i) => ({ mediaId: it.mediaId, position: i, durationSec: it.duration })),
      };
      if (currentPlaylistId) {
        await updatePlaylist(currentPlaylistId, payload);
      } else {
        const created = await createPlaylist(payload);
        setCurrentPlaylistId(created.id);
        router.replace(`/agent/playlists/create-playlist?id=${created.id}`);
      }
      setBaseline(items);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save playlist");
    } finally {
      setSaving(false);
    }
  }, [playlistName, items, currentPlaylistId, router, setBaseline]);

  const publish = useCallback(async () => {
    setPublishModalOpen(true);
    await save();
  }, [save]);

  const closePublishModal = useCallback(() => setPublishModalOpen(false), []);

  const finishPublish = useCallback(() => {
    setPublishModalOpen(false);
    router.push("/agent/playlists");
  }, [router]);

  const play = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((t) => {
        const total = items.reduce((a, it) => a + it.duration, 0) || 1;
        return (t + 0.08) % total;
      });
    }, 80);
    setPlaying(true);
  }, [items]);

  const pause = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
  }, []);

  const deleteSelected = useCallback(() => {
    if (selectedId == null) return;
    const nextItems = items.filter((it) => it.instanceId !== selectedId);
    setSelectedId(null);
    commit(nextItems);
  }, [items, selectedId, commit]);

  const moveSelected = useCallback(
    (dir: -1 | 1) => {
      const i = items.findIndex((it) => it.instanceId === selectedId);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= items.length) return;
      const next = items.slice();
      const [x] = next.splice(i, 1);
      next.splice(j, 0, x);
      commit(next);
    },
    [items, selectedId, commit]
  );

  const duplicateSelected = useCallback(() => {
    const sel = items.find((it) => it.instanceId === selectedId);
    if (!sel) return;
    const idx = items.indexOf(sel);
    const next = items.slice();
    const newInstanceId = genInstanceId();
    next.splice(idx + 1, 0, { ...sel, instanceId: newInstanceId });
    setSelectedId(newInstanceId);
    commit(next);
  }, [items, selectedId, genInstanceId, commit]);

  const updateSelected = useCallback(
    (field: keyof PlaylistClip, value: PlaylistClip[keyof PlaylistClip]) => {
      const next = items.map((it) => (it.instanceId === selectedId ? { ...it, [field]: value } : it));
      commit(next);
    },
    [items, selectedId, commit]
  );

  const setDisplayProfile = useCallback((name: string, w: number, h: number, extraDevice?: string) => {
    setDisplayState({ name, w, h });
    if (extraDevice) setDevice(extraDevice);
  }, []);

  // Pointer-drag machinery for reorder + resize on the timeline. The listeners are attached
  // once and read fresh state via refs, so a gesture in progress never gets its handlers
  // swapped out mid-drag (which could otherwise drop pointer events).
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (dragCtx.current) {
        const next = { id: dragCtx.current.id, dx: e.clientX - dragCtx.current.startX };
        dragRef.current = next;
        setDrag(next);
      } else if (resizeCtx.current) {
        const dx = e.clientX - resizeCtx.current.startX;
        const dur = Math.max(1, Math.round((resizeCtx.current.startDuration + dx / zoomRef.current) * 2) / 2);
        const rid = resizeCtx.current.id;
        setItems((prev) => prev.map((it) => (it.instanceId === rid ? { ...it, duration: dur } : it)));
        setDirty(true);
      }
    };

    const handleUp = () => {
      if (dragCtx.current) {
        const { id } = dragCtx.current;
        const dragState = dragRef.current;
        dragCtx.current = null;
        dragRef.current = null;
        setDrag(null);

        if (dragState && Math.abs(dragState.dx) > 4) {
          const pps = zoomRef.current;
          const current = itemsRef.current.slice();
          const i = current.findIndex((it) => it.instanceId === id);
          if (i >= 0) {
            let start = 0;
            for (let k = 0; k < i; k++) start += current[k].duration;
            const center = start + dragState.dx / pps + current[i].duration / 2;
            const [moved] = current.splice(i, 1);
            let acc = 0;
            let insert = current.length;
            for (let k = 0; k < current.length; k++) {
              if (center < acc + current[k].duration / 2) {
                insert = k;
                break;
              }
              acc += current[k].duration;
            }
            current.splice(insert, 0, moved);
            setItems(current);
            setDirty(true);
            pushHistory(current);
          }
        }
      }
      if (resizeCtx.current) {
        resizeCtx.current = null;
        pushHistory(itemsRef.current);
      }
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [pushHistory]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const total = items.reduce((a, it) => a + it.duration, 0);
  const sel = items.find((it) => it.instanceId === selectedId) || null;
  const dispLandscape = display.w >= display.h;

  const starts = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const it of items) {
      out.push(acc);
      acc += it.duration;
    }
    return out;
  }, [items]);

  let curIdx = 0;
  for (let i = 0; i < items.length; i++) {
    if (time >= starts[i] && time < starts[i] + items[i].duration) {
      curIdx = i;
      break;
    }
  }
  const cur = items[curIdx] || null;
  const clipProgress = cur ? (time - starts[curIdx]) / cur.duration : 0;
  const curCompat = cur ? getCompatibility(cur, display) : null;
  const selCompat = sel ? getCompatibility(sel, display) : null;
  const selIdx = sel ? items.indexOf(sel) : -1;

  const clips = useMemo(
    () =>
      items.map((it, i) => {
        const selected = it.instanceId === selectedId;
        const c = getCompatibility(it, display);
        const warning = c.level === "warn";
        const dragging = drag && drag.id === it.instanceId;
        return {
          clip: it,
          name: it.name,
          type: it.type,
          isVideo: it.type === "Video",
          isImage: it.type === "Image",
          isHtml: it.type === "HTML5",
          left: PAD + starts[i] * zoom,
          width: Math.max(46, it.duration * zoom - 3),
          bg: CLIP_TYPE_COLORS[it.type] || CLIP_TYPE_COLORS.Image,
          selected,
          warning,
          dragging: !!dragging,
          dragDx: dragging ? drag!.dx : 0,
          durLabel: `${it.duration}s`,
          transitionName: it.transition === "Cut" ? "Cut" : `${it.transition} ${it.transDur}s`,
          tooltip: `${it.name} — ${c.label}${warning ? ". " + c.tip : ""}`,
          resizable: it.type !== "Video",
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
          onPointerDown: (e: React.PointerEvent) => {
            if (e.button !== 0) return;
            e.stopPropagation();
            dragCtx.current = { id: it.instanceId, startX: e.clientX };
            setSelectedId(it.instanceId);
            setDrag({ id: it.instanceId, dx: 0 });
          },
          onResizeDown: (e: React.PointerEvent) => {
            e.stopPropagation();
            resizeCtx.current = { id: it.instanceId, startX: e.clientX, startDuration: it.duration };
            setSelectedId(it.instanceId);
          },
        };
      }),
    [items, selectedId, display, drag, starts, zoom]
  );

  const transMarkers = useMemo(
    () =>
      items.slice(1).map((it, k) => {
        const i = k + 1;
        return {
          key: it.instanceId,
          left: PAD + starts[i] * zoom,
          tooltip: `Transition: ${it.transition}${it.transition === "Cut" ? "" : ` (${it.transDur}s)`} — click to cycle`,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            const order: Transition[] = ["Fade", "Crossfade", "Cut"];
            const next = order[(order.indexOf(it.transition) + 1) % 3];
            const nextItems = items.map((x) =>
              x.instanceId === it.instanceId ? { ...x, transition: next, transDur: next === "Cut" ? 0 : x.transDur || 1 } : x
            );
            commit(nextItems);
          },
        };
      }),
    [items, starts, zoom, commit]
  );

  const ticks = useMemo(() => {
    const rulerMax = Math.max(total + 8, 40);
    const out: { left: number; label: string }[] = [];
    for (let t = 0; t <= rulerMax; t += 5) out.push({ left: PAD + t * zoom, label: `${t}s` });
    return out;
  }, [total, zoom]);

  const q = search.trim().toLowerCase();
  const libItems = useMemo(
    () =>
      libraryAssets
        .filter((m) => filter === "All" || m.type === filter)
        .filter((m) => !q || m.name.toLowerCase().includes(q))
        .map((m) => {
          const c = getCompatibility(m, display);
          return {
            asset: m,
            name: m.name,
            size: m.size,
            dims: m.w ? `${m.w}×${m.h}` : "Flexible",
            thumb: m.thumb,
            isVideo: m.type === "Video",
            isImage: m.type === "Image",
            isHtml: m.type === "HTML5",
            compatShort: c.short,
            compatOk: c.level === "ok",
            compatTip: `${c.label}. ${c.tip}`,
            processing: m.status !== "Ready",
            onAdd: () => {
              const newInstanceId = genInstanceId();
              const nextItems = items.concat([
                {
                  instanceId: newInstanceId,
                  mediaId: m.id,
                  name: m.name,
                  type: m.type,
                  w: m.w,
                  h: m.h,
                  size: m.size,
                  duration: m.dur,
                  transition: "Fade",
                  transDur: 1,
                  thumb: m.thumb,
                  src: m.src,
                  fit: "Fill",
                },
              ]);
              setSelectedId(newInstanceId);
              commit(nextItems);
            },
          };
        }),
    [libraryAssets, filter, q, display, items, genInstanceId, commit]
  );

  const filterTabs = ["All", "Video", "Image", "HTML5"].map((label) => ({
    label,
    active: filter === label,
    onClick: () => setFilter(label),
  }));

  const overviewBlocks = items.map((it) => ({
    key: it.instanceId,
    widthPct: total ? (it.duration / total) * 100 : 0,
    bg: it.type === "Image" ? "#D97C1E" : it.type === "Video" ? "#7A5236" : "#2F5FD4",
    opacity: it.instanceId === selectedId ? 1 : 0.55,
  }));

  const dAR = display.w / display.h;
  let dispIconW: number, dispIconH: number;
  if (dAR >= 22 / 16) {
    dispIconW = 22;
    dispIconH = Math.max(5, 22 / dAR);
  } else {
    dispIconH = 16;
    dispIconW = Math.max(5, 16 * dAR);
  }

  const presetCards = DISPLAY_PRESETS.map((p) => {
    const active = display.name === p.name;
    const ar = p.w / p.h;
    let pw: number, ph: number;
    if (ar >= 1) {
      pw = 44;
      ph = Math.max(8, 44 / ar);
    } else {
      ph = 34;
      pw = Math.max(10, 34 * ar);
    }
    return {
      key: p.name,
      name: p.name,
      res: `${p.w} × ${p.h}`,
      aspect: aspectRatioLabel(p.w, p.h),
      orient: p.w >= p.h ? "Landscape" : "Portrait",
      iconW: pw,
      iconH: ph,
      active,
      onClick: () => setDisplayProfile(p.name, p.w, p.h),
    };
  });

  const deviceCards = DEVICE_PROFILES.map((d) => {
    const active = device === d.name;
    return {
      key: d.name,
      name: d.name,
      category: d.category,
      res: `${d.w}×${d.h}`,
      bitrate: d.bitrate,
      formats: d.formats,
      active,
      onClick: () => {
        const orientName = d.w >= d.h ? "Landscape" : "Portrait";
        setDisplayProfile(`${orientName} ${aspectRatioLabel(d.w, d.h)}`, d.w, d.h, d.name);
      },
    };
  });

  const CONFIG_TAB_DEFS: { id: DisplayConfigTab; label: string }[] = [
    { id: "presets", label: "Presets" },
    { id: "devices", label: "Device Templates" },
    { id: "custom", label: "Custom Resolution" },
  ];
  const configTabs = CONFIG_TAB_DEFS.map((t) => ({
    ...t,
    active: configTab === t.id,
    onClick: () => setConfigTab(t.id),
  }));

  const cAR = (customW || 1) / (customH || 1);
  let customPrevW: number, customPrevH: number;
  if (cAR >= 200 / 160) {
    customPrevW = 200;
    customPrevH = Math.max(20, 200 / cAR);
  } else {
    customPrevH = 160;
    customPrevW = Math.max(20, 160 * cAR);
  }

  const anyWarn = items.some((it) => getCompatibility(it, display).level === "warn");
  const dev = DEVICE_PROFILES.find((d) => d.name === device);

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const t = Math.max(0, Math.min(total, (e.clientX - rect.left - PAD) / zoom));
      setTime(t);
    },
    [total, zoom]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName?.toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (e.key === " ") {
        e.preventDefault();
        if (playing) pause();
        else play();
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        deleteSelected();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key === "Escape") {
        setDisplayConfigOpen(false);
      }
    },
    [playing, pause, play, deleteSelected, redo, undo]
  );

  const totalLabel = formatDuration(total);

  const statusText = saving
    ? "Saving…"
    : saveError
    ? "Save failed"
    : dirty
    ? "Unsaved changes"
    : "Saved";

  return {
    onKeyDown,
    loading,
    loadError,

    toolbar: {
      playlistName,
      onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(e.target.value);
        setDirty(true);
      },
      itemCount: items.length,
      totalLabel,
      dirty,
      saving,
      saveError,
      statusText,
      onUndo: undo,
      onRedo: redo,
      undoDisabled: histIdx <= 0,
      redoDisabled: histIdx >= history.length - 1,
      displayName: display.name,
      displayRes: `${display.w} × ${display.h}`,
      displayAspect: aspectRatioLabel(display.w, display.h),
      dispIconW,
      dispIconH,
      onOpenDisplayConfig: () => setDisplayConfigOpen(true),
      onSaveDraft: save,
      onPublish: publish,
    },

    library: {
      search,
      onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
      filterTabs,
      viewMode,
      onGridMode: () => setViewMode("grid"),
      onListMode: () => setViewMode("list"),
      items: libItems,
      empty: libItems.length === 0,
    },

    preview: {
      displayName: display.name,
      displayRes: `${display.w} × ${display.h}`,
      aspect: `${display.w} / ${display.h}`,
      landscape: dispLandscape,
      thumb: cur ? cur.thumb : "#000",
      letterbox: !!(curCompat && curCompat.level === "warn" && cur?.w && cur.h > cur.w && dispLandscape),
      assetAspect: cur && cur.w ? `${cur.w} / ${cur.h}` : "9 / 16",
      warning: !!(curCompat && curCompat.level === "warn"),
      warningText: curCompat ? curCompat.label : "",
      currentClipKey: cur ? cur.instanceId : "empty",
      currentClipType: cur ? cur.type : null,
      currentClipSrc: cur?.src || null,
      currentClipFit: cur ? cur.fit : "Fill",
      currentClipName: cur ? cur.name : "No clips",
      clipProgressPct: (clipProgress * 100).toFixed(1),
      playing,
      onPlayPause: () => (playing ? pause() : play()),
      onRestart: () => setTime(0),
      timeLabel: formatDuration(time),
      totalLabel,
      safeTitleOn: safeTitle,
      safeActionOn: safeAction,
      safeBleedOn: safeBleed,
      onToggleSafeTitle: () => setSafeTitle((v) => !v),
      onToggleSafeAction: () => setSafeAction((v) => !v),
      onToggleSafeBleed: () => setSafeBleed((v) => !v),
    },

    inspector: {
      displayName: display.name,
      displayRes: `${display.w} × ${display.h}`,
      displayAspect: aspectRatioLabel(display.w, display.h),
      deviceName: device,
      deviceBitrate: dev ? dev.bitrate : "—",
      deployCompat: anyWarn ? "⚠ Warnings in loop" : "✓ Fully Supported",
      deployCompatWarn: anyWarn,
      onOpenDisplayConfig: () => setDisplayConfigOpen(true),
      hasSelection: !!sel,
      selName: sel ? sel.name : "",
      selType: sel ? sel.type : "",
      selDims: sel ? (sel.w ? `${sel.w}×${sel.h}` : "Flexible") : "",
      selThumb: sel ? sel.thumb : "#000",
      selCompat,
      selDuration: sel ? sel.duration : "",
      selTransDur: sel ? sel.transDur : "",
      selTransition: sel ? sel.transition : "Fade",
      onDurationChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateSelected("duration", Math.max(1, Number(e.target.value) || 1)),
      onTransDurChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateSelected("transDur", Math.max(0, Number(e.target.value) || 0)),
      onTransitionChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
        updateSelected("transition", e.target.value as Transition),
      selFit: sel ? sel.fit : "Fill",
      onFitContain: () => updateSelected("fit", "Fit" as Fit),
      onFitCover: () => updateSelected("fit", "Fill" as Fit),
      fallback,
      fallbackOptions: FALLBACK_OPTIONS,
      onFallbackChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFallback(e.target.value);
        setDirty(true);
      },
    },

    timeline: {
      itemCount: items.length,
      totalLabel,
      zoom,
      onZoomChange: (e: React.ChangeEvent<HTMLInputElement>) => setZoom(Number(e.target.value)),
      onZoomIn: () => setZoom((z) => Math.min(60, z + 4)),
      onZoomOut: () => setZoom((z) => Math.max(8, z - 4)),
      timelineWidth: PAD * 2 + Math.max(total + 8, 40) * zoom,
      ticks,
      clips,
      transMarkers,
      playheadLeft: PAD + time * zoom,
      onRulerClick: seek,
      onLaneClick: (e: React.MouseEvent<HTMLDivElement>) => {
        seek(e);
        setSelectedId(null);
      },
      lockedTracks: LOCKED_TRACKS,
      overviewBlocks,
      selActionsVisible: !!sel && !drag,
      selActionsLeft: sel ? PAD + starts[selIdx] * zoom + 4 : 0,
      onSelLeft: (e: React.MouseEvent) => {
        e.stopPropagation();
        moveSelected(-1);
      },
      onSelRight: (e: React.MouseEvent) => {
        e.stopPropagation();
        moveSelected(1);
      },
      onSelDuplicate: (e: React.MouseEvent) => {
        e.stopPropagation();
        duplicateSelected();
      },
      onSelDelete: (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteSelected();
      },
    },

    displayModal: {
      open: displayConfigOpen,
      onClose: () => setDisplayConfigOpen(false),
      configTab,
      configTabs,
      presetCards,
      deviceCards,
      customW,
      customH,
      customAspect: aspectRatioLabel(customW, customH),
      customPrevW,
      customPrevH,
      onCustomW: (e: React.ChangeEvent<HTMLInputElement>) => setCustomW(Math.max(1, Number(e.target.value) || 1)),
      onCustomH: (e: React.ChangeEvent<HTMLInputElement>) => setCustomH(Math.max(1, Number(e.target.value) || 1)),
      onApplyCustom: () => setDisplayProfile("Custom", customW, customH),
      displayName: display.name,
      displayRes: `${display.w} × ${display.h}`,
      displayAspect: aspectRatioLabel(display.w, display.h),
      deviceName: device,
    },

    publishModal: {
      open: publishModalOpen,
      saving,
      error: saveError,
      onClose: closePublishModal,
      onRetry: publish,
      onDone: finishPublish,
      playlistName,
      itemCount: items.length,
      totalLabel,
      displayName: display.name,
      displayRes: `${display.w} × ${display.h}`,
      deviceName: device,
    },
  };
}
