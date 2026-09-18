"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Tab, FileId, SidebarPanel, PortfolioData } from "@/app/(vscode)/types";

// Map of icon names to icon components for serialization
const iconMap: Record<string, LucideIcon> = {
  FileCode2: LucideIcons.FileCode2,
  FileText: LucideIcons.FileText,
  Folder: LucideIcons.Folder,
  // Add more icons as needed
};

interface StoredTab {
  id: FileId;
  name: string;
  iconName: string;
  iconColor?: string;
}

interface PortfolioContextValue {
  openTabs: Tab[];
  activeTabId: FileId | null;
  sidebarPanel: SidebarPanel;
  sidebarOpen: boolean;
  chatOpen: boolean;
  chatExpanded: boolean;
  bottomPanelOpen: boolean;
  isMobile: boolean;
  data: PortfolioData;
  openFile: (
    id: FileId,
    name: string,
    icon: LucideIcon,
    iconColor?: string,
  ) => void;
  closeTab: (id: FileId) => void;
  setActiveTab: (id: FileId) => void;
  setSidebarPanel: (panel: SidebarPanel) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleChat: () => void;
  closeChat: () => void;
  toggleChatExpand: () => void;
  toggleBottomPanel: () => void;
  closeBottomPanel: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: PortfolioData;
}) {
  // Helper function to get icon name from component
  const getIconName = (icon: LucideIcon): string => {
    for (const [name, IconComponent] of Object.entries(LucideIcons)) {
      if (IconComponent === icon) return name;
    }
    return "FileCode2"; // fallback
  };

  // Helper function to get icon component from name
  const getIconFromName = (iconName: string): LucideIcon => {
    return iconMap[iconName] || LucideIcons.FileCode2;
  };

  // Responsive breakpoint detection (SSR-safe)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // All state starts with SSR-safe defaults; localStorage is hydrated in useEffect
  const [openTabs, setOpenTabsState] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabIdState] = useState<FileId | null>(null);
  const [sidebarPanel, setSidebarPanelState] = useState<SidebarPanel>("explorer");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpenState] = useState(false);
  const [chatExpanded, setChatExpandedState] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpenState] = useState(true);

  // Hydrate from URL query param or localStorage after mount
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const savedTabs = localStorage.getItem("ide-open-tabs");
      if (savedTabs) {
        const storedTabs: StoredTab[] = JSON.parse(savedTabs);
        setOpenTabsState(
          storedTabs.map((tab) => ({
            id: tab.id,
            name: tab.name,
            icon: getIconFromName(tab.iconName),
            iconColor: tab.iconColor,
          })),
        );
      }
    } catch {}

    // URL takes priority over localStorage for active tab
    const fileParam = searchParams.get("file");
    if (fileParam) {
      setActiveTabIdState(fileParam);
    } else {
      setActiveTabIdState(localStorage.getItem("ide-active-tab") || null);
    }

    const chatSaved = localStorage.getItem("ide-chat-open");
    if (chatSaved === "true") setChatOpenState(true);

    const chatExpandedSaved = localStorage.getItem("ide-chat-expanded");
    if (chatExpandedSaved === "false") setChatExpandedState(false);

    const bottomSaved = localStorage.getItem("ide-bottom-panel-open");
    if (bottomSaved === "true") setBottomPanelOpenState(true);
  }, [searchParams]);

  // Persist state changes to localStorage
  useEffect(() => {
    const storedTabs: StoredTab[] = openTabs.map((tab) => ({
      id: tab.id,
      name: tab.name,
      iconName: getIconName(tab.icon),
      iconColor: tab.iconColor,
    }));
    localStorage.setItem("ide-open-tabs", JSON.stringify(storedTabs));
  }, [openTabs]);

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem("ide-active-tab", activeTabId);
      // Sync active tab to URL query param
      const params = new URLSearchParams(window.location.search);
      if (params.get("file") !== activeTabId) {
        params.set("file", activeTabId);
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    } else {
      localStorage.removeItem("ide-active-tab");
      // Remove file param when no tab is active
      const params = new URLSearchParams(window.location.search);
      if (params.has("file")) {
        params.delete("file");
        const qs = params.toString();
        router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
      }
    }
  }, [activeTabId, router]);

  useEffect(() => {
    localStorage.setItem("ide-chat-open", String(chatOpen));
  }, [chatOpen]);

  useEffect(() => {
    localStorage.setItem("ide-chat-expanded", String(chatExpanded));
  }, [chatExpanded]);

  useEffect(() => {
    localStorage.setItem("ide-bottom-panel-open", String(bottomPanelOpen));
  }, [bottomPanelOpen]);

  const openFile = useCallback(
    (id: FileId, name: string, icon: LucideIcon, iconColor?: string) => {
      setOpenTabsState((prev) => {
        if (prev.find((t) => t.id === id)) return prev;
        return [...prev, { id, name, icon, iconColor }];
      });
      setActiveTabIdState(id);
    },
    [],
  );

  const closeTab = useCallback(
    (id: FileId) => {
      setOpenTabsState((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const fallback = next[idx] || next[idx - 1] || null;
          setActiveTabIdState(fallback?.id ?? null);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const setActiveTab = useCallback((id: FileId) => {
    setActiveTabIdState(id);
  }, []);

  const setSidebarPanel = useCallback((panel: SidebarPanel) => {
    setSidebarPanelState(panel);
    setSidebarOpen(true);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((p) => !p);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setChatOpenState((p) => !p);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpenState(false);
  }, []);

  const toggleChatExpand = useCallback(() => {
    setChatExpandedState((p) => !p);
  }, []);

  const toggleBottomPanel = useCallback(() => {
    setBottomPanelOpenState((p) => !p);
  }, []);

  const closeBottomPanel = useCallback(() => {
    setBottomPanelOpenState(false);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        openTabs,
        activeTabId,
        sidebarPanel,
        sidebarOpen,
        chatOpen,
        chatExpanded,
        bottomPanelOpen,
        isMobile,
        data,
        openFile,
        closeTab,
        setActiveTab,
        setSidebarPanel,
        toggleSidebar,
        closeSidebar,
        toggleChat,
        closeChat,
        toggleChatExpand,
        toggleBottomPanel,
        closeBottomPanel,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
