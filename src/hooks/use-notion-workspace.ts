import { useState, useEffect, useCallback, useRef } from "react";

export interface NotionPageSummary {
  id: string;
  title: string;
  type: "page" | "database";
  icon: string | null;
  parentId: string | null;
  lastEdited: string;
}

export interface NotionPageDetail {
  id: string;
  title: string;
  icon: string | null;
  url: string;
  parentId: string | null;
  lastEdited: string;
  markdown: string;
  blocks: any[];
}

export function useNotionWorkspace() {
  const [pages, setPages] = useState<NotionPageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Fetch all pages with auto-pagination
  const fetchPages = useCallback(async (query = "") => {
    try {
      setLoading(true);
      const allPages: NotionPageSummary[] = [];
      let cursor: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const url = new URL("/api/notion/workspace", window.location.origin);
        if (query) url.searchParams.set("query", query);
        if (cursor) url.searchParams.set("cursor", cursor);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();

        allPages.push(...(data.pages ?? []));
        hasMore = data.hasMore ?? false;
        cursor = data.nextCursor ?? undefined;

        // Safety: max 5 pages of results (250 pages)
        if (allPages.length > 250) break;
      }

      setPages(allPages);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => { fetchPages(); }, [fetchPages]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPages(searchQuery);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, fetchPages]);

  const fetchPageDetail = useCallback(async (id: string): Promise<NotionPageDetail> => {
    const res = await fetch(`/api/notion/workspace/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error ?? "Failed to fetch page");
    }
    const data = await res.json();
    return {
      id: data.page.id,
      title: data.page.title,
      icon: data.page.icon,
      url: data.page.url,
      parentId: data.page.parentId,
      lastEdited: data.page.lastEdited,
      markdown: data.markdown,
      blocks: data.blocks,
    };
  }, []);

  const updatePage = useCallback(async (id: string, updates: { title?: string; markdown?: string }) => {
    const res = await fetch(`/api/notion/workspace/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Update failed" }));
      throw new Error(err.error ?? "Update failed");
    }
  }, []);

  // Build breadcrumb for a page
  const getBreadcrumb = useCallback((pageId: string): NotionPageSummary[] => {
    const trail: NotionPageSummary[] = [];
    const visited = new Set<string>();
    let current = pages.find((p) => p.id === pageId);
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      trail.unshift(current);
      if (!current.parentId) break;
      current = pages.find((p) => p.id === current!.parentId);
    }
    return trail;
  }, [pages]);

  return {
    pages,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchPages,
    fetchPageDetail,
    updatePage,
    getBreadcrumb,
  };
}
