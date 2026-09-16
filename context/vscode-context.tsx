"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import type { Tab, FileId, SidebarPanel, PortfolioData } from "@/app/(vscode)/types";

interface PortfolioContextValue {
  openTabs: Tab[];
  activeTabId: FileId | null;
  sidebarPanel: SidebarPanel;
  sidebarOpen: boolean;
  chatOpen: boolean;
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
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({
  children,
  data,
}: {
  children: ReactNode;
  data: PortfolioData;
}) {
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<FileId | null>(null);
  const [sidebarPanel, setSidebarPanelState] =
    useState<SidebarPanel>("explorer");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const openFile = useCallback(
    (id: FileId, name: string, icon: LucideIcon, iconColor?: string) => {
      setOpenTabs((prev) => {
        if (prev.find((t) => t.id === id)) return prev;
        return [...prev, { id, name, icon, iconColor }];
      });
      setActiveTabId(id);
    },
    [],
  );

  const closeTab = useCallback(
    (id: FileId) => {
      setOpenTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        const next = prev.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const fallback = next[idx] || next[idx - 1] || null;
          setActiveTabId(fallback?.id ?? null);
        }
        return next;
      });
    },
    [activeTabId],
  );

  const setActiveTab = useCallback((id: FileId) => {
    setActiveTabId(id);
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
    setChatOpen((p) => !p);
  }, []);

  const closeChat = useCallback(() => {
    setChatOpen(false);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        openTabs,
        activeTabId,
        sidebarPanel,
        sidebarOpen,
        chatOpen,
        data,
        openFile,
        closeTab,
        setActiveTab,
        setSidebarPanel,
        toggleSidebar,
        closeSidebar,
        toggleChat,
        closeChat,
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
