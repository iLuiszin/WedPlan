'use client';

import { useEffect } from 'react';

const STORAGE_KEY = '@wedplan:recent-projects';

export function RecentProjectWriter(props: {
  project: {
    _id: string;
    slug?: string;
    brideFirstName?: string;
    groomFirstName?: string;
  };
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Array<{ _id: string } & Record<string, unknown>> = raw ? JSON.parse(raw) : [];
      const newItem = { ...props.project, lastAccessed: new Date().toISOString() };
      const filtered = list.filter((i) => i._id !== newItem._id);
      const next = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [props.project]);

  return null;
}
