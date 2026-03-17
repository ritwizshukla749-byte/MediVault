/**
 * BadgeContext
 * Tracks live unread counts for Notifications and Messages.
 * When user visits those screens, counts reset to 0.
 * Sidebar reads from here so badges disappear after visiting.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';

interface BadgeContextValue {
  notifCount:    number;
  messageCount:  number;
  clearNotifs:   () => void;
  clearMessages: () => void;
}

const BadgeContext = createContext<BadgeContextValue>({
  notifCount:    0,
  messageCount:  0,
  clearNotifs:   () => {},
  clearMessages: () => {},
});

export function BadgeProvider({ children }: { children: React.ReactNode }) {
  // Initial counts matching the mock data
  const [notifCount,   setNotifCount]   = useState(3); // doctor has 3 unread notifs
  const [messageCount, setMessageCount] = useState(3); // 3 unread message conversations

  const clearNotifs   = useCallback(() => setNotifCount(0),   []);
  const clearMessages = useCallback(() => setMessageCount(0), []);

  return (
    <BadgeContext.Provider value={{ notifCount, messageCount, clearNotifs, clearMessages }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  return useContext(BadgeContext);
}
