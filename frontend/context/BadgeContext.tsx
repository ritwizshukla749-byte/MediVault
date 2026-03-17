/**
 * BadgeContext — Single source of truth for all persistent app state
 *
 * Owns:
 *  - Sidebar badge counts (notif, message, alert)
 *  - Alerts list          → persists across navigation
 *  - Notifications lists  → persists across navigation
 *  - Messages/threads     → persists across navigation
 *  - Doctor settings      → persists across navigation
 *  - Patient settings     → persists across navigation
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { doctorAlerts } from '../data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AlertItem = typeof doctorAlerts[0];

export type NotifItem = {
  id: number; icon: string; title: string; body: string;
  time: string; read: boolean; tag: string;
};

export type Message = {
  id: number; from: 'patient' | 'doctor';
  text: string; time: string; read: boolean;
};

export type DoctorSettings = {
  criticalPatientAlerts: boolean;
  missedDoseAlerts:      boolean;
  newReportUploads:      boolean;
  smsDeliveryConfirm:    boolean;
  weeklyPatientSummary:  boolean;
  lowAdherenceWarning:   boolean;
};

export type PatientSettings = {
  medicationReminders:   boolean;
  missedDoseAlerts:      boolean;
  doctorMessages:        boolean;
  aiReportReady:         boolean;
  weeklyAdherenceReport: boolean;
  streakMilestones:      boolean;
};

// ─── Initial data ─────────────────────────────────────────────────────────────
const INIT_DOCTOR_NOTIFS: NotifItem[] = [
  { id:1, icon:'🚨', title:'Critical: Rahul Singh',      body:'High fever 104°F — immediate attention required.',          time:'2 min ago',  read:false, tag:'Critical'  },
  { id:2, icon:'⚠️', title:'Missed Doses: Vikram Patel', body:'3 consecutive Antibiotic doses missed. Caregiver notified.', time:'18 min ago', read:false, tag:'Adherence' },
  { id:3, icon:'📋', title:'New Report: Anita Rao',      body:'Blood Test uploaded. AI summary ready for review.',          time:'1 hr ago',   read:false, tag:'Report'    },
  { id:4, icon:'📱', title:'SMS Delivered',              body:'Your SMS to Rahul Singh was delivered via Twilio.',           time:'2 hrs ago',  read:true,  tag:'SMS'       },
  { id:5, icon:'🤖', title:'AI Summary Ready',           body:'Chest X-Ray analysed for Priya Sharma. No abnormalities.',   time:'3 hrs ago',  read:true,  tag:'AI'        },
  { id:6, icon:'💊', title:'Prescription Updated',       body:"Vitamin D3 added to Rahul Singh's prescription.",            time:'5 hrs ago',  read:true,  tag:'Medicine'  },
];

const INIT_PATIENT_NOTIFS: NotifItem[] = [
  { id:1, icon:'💊', title:'Take Paracetamol 500mg',    body:'Your 8:00 AM dose is due. Tap to mark as taken.',            time:'Just now',   read:false, tag:'Medicine' },
  { id:2, icon:'🤖', title:'AI Report Summary Ready',   body:'Your Blood Test has been analysed. View summary.',           time:'10 min ago', read:false, tag:'AI'       },
  { id:3, icon:'💬', title:'Dr. Meera Kapoor',          body:'Take rest and keep drinking fluids. Check tomorrow.',         time:'1 hr ago',   read:false, tag:'Message'  },
  { id:4, icon:'🔥', title:'7-Day Streak! 🎉',          body:'Amazing! 7 days of perfect medication adherence!',           time:'3 hrs ago',  read:true,  tag:'Streak'   },
  { id:5, icon:'📋', title:'New Record Added',          body:'Dr. Kapoor added an OPD visit to your health timeline.',     time:'Yesterday',  read:true,  tag:'Record'   },
  { id:6, icon:'🔲', title:'QR Profile Updated',        body:'Emergency QR regenerated with updated medication details.',   time:'Yesterday',  read:true,  tag:'System'   },
];

const INIT_MESSAGES: Record<number, Message[]> = {
  1: [
    { id:1, from:'patient', text:'Hello Doctor, I have been having high fever since yesterday morning.', time:'10:02 AM', read:true  },
    { id:2, from:'doctor',  text:'Hello Rahul, I can see your symptoms. How high is the temperature?',  time:'10:05 AM', read:true  },
    { id:3, from:'patient', text:'It is 104°F. I also have severe headache and body pain.',              time:'10:07 AM', read:true  },
    { id:4, from:'doctor',  text:'Please take Paracetamol 500mg immediately and drink plenty of fluids.',time:'10:09 AM', read:true  },
    { id:5, from:'patient', text:'Doctor, my fever is still high.',                                      time:'10:45 AM', read:false },
  ],
  4: [
    { id:1, from:'patient', text:'Blood pressure is 130/85 today.', time:'Yesterday', read:false },
  ],
};

const INIT_DOCTOR_SETTINGS: DoctorSettings = {
  criticalPatientAlerts: true,
  missedDoseAlerts:      true,
  newReportUploads:      true,
  smsDeliveryConfirm:    false,
  weeklyPatientSummary:  true,
  lowAdherenceWarning:   true,
};

const INIT_PATIENT_SETTINGS: PatientSettings = {
  medicationReminders:   true,
  missedDoseAlerts:      true,
  doctorMessages:        true,
  aiReportReady:         true,
  weeklyAdherenceReport: false,
  streakMilestones:      true,
};

// ─── Context interface ────────────────────────────────────────────────────────
interface BadgeContextValue {
  // Badge counts
  notifCount:    number;
  messageCount:  number;
  alertCount:    number;
  clearNotifs:   () => void;
  clearMessages: () => void;
  clearAlerts:   () => void;

  // Alerts
  alerts:        AlertItem[];
  respondAlert:  (id: number) => void;
  dismissAlert:  (id: number) => void;

  // Notifications
  doctorNotifs:  NotifItem[];
  patientNotifs: NotifItem[];
  markOneNotif:  (role: 'doctor' | 'patient', id: number) => void;
  markAllNotifs: (role: 'doctor' | 'patient') => void;
  removeNotif:   (role: 'doctor' | 'patient', id: number) => void;

  // Messages
  messages:      Record<number, Message[]>;
  openConv:      (id: number) => void;
  sendMessage:   (convId: number, text: string) => void;

  // Settings — persists across navigation, shared app-wide
  doctorSettings:    DoctorSettings;
  patientSettings:   PatientSettings;
  toggleDoctorSetting:  (key: keyof DoctorSettings)  => void;
  togglePatientSetting: (key: keyof PatientSettings) => void;
}

const BadgeContext = createContext<BadgeContextValue>({
  notifCount: 0, messageCount: 0, alertCount: 0,
  clearNotifs: () => {}, clearMessages: () => {}, clearAlerts: () => {},
  alerts: [], respondAlert: () => {}, dismissAlert: () => {},
  doctorNotifs: [], patientNotifs: [],
  markOneNotif: () => {}, markAllNotifs: () => {}, removeNotif: () => {},
  messages: {}, openConv: () => {}, sendMessage: () => {},
  doctorSettings: INIT_DOCTOR_SETTINGS,
  patientSettings: INIT_PATIENT_SETTINGS,
  toggleDoctorSetting: () => {},
  togglePatientSetting: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export function BadgeProvider({ children }: { children: React.ReactNode }) {

  // Badge counts
  const [notifCount,   setNotifCount]   = useState(3);
  const [messageCount, setMessageCount] = useState(3);
  const [alertCount,   setAlertCount]   = useState(2);

  const clearNotifs   = useCallback(() => setNotifCount(0),   []);
  const clearMessages = useCallback(() => setMessageCount(0), []);
  const clearAlerts   = useCallback(() => setAlertCount(0),   []);

  // Alerts
  const [alerts, setAlerts] = useState<AlertItem[]>(doctorAlerts);

  const respondAlert = useCallback((id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, responded: true } : a));
    setAlertCount(prev => Math.max(0, prev - 1));
  }, []);

  const dismissAlert = useCallback((id: number) => {
    setAlerts(prev => {
      const target = prev.find(a => a.id === id);
      if (target && !target.responded) setAlertCount(c => Math.max(0, c - 1));
      return prev.filter(a => a.id !== id);
    });
  }, []);

  // Notifications
  const [doctorNotifs,  setDoctorNotifs]  = useState<NotifItem[]>(INIT_DOCTOR_NOTIFS);
  const [patientNotifs, setPatientNotifs] = useState<NotifItem[]>(INIT_PATIENT_NOTIFS);

  const markOneNotif = useCallback((role: 'doctor' | 'patient', id: number) => {
    const set = role === 'doctor' ? setDoctorNotifs : setPatientNotifs;
    set(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotifs = useCallback((role: 'doctor' | 'patient') => {
    const set = role === 'doctor' ? setDoctorNotifs : setPatientNotifs;
    set(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotif = useCallback((role: 'doctor' | 'patient', id: number) => {
    const set = role === 'doctor' ? setDoctorNotifs : setPatientNotifs;
    set(prev => prev.filter(n => n.id !== id));
  }, []);

  // Messages
  const [messages, setMessages] = useState<Record<number, Message[]>>(INIT_MESSAGES);

  const openConv = useCallback((id: number) => {
    setMessages(prev => ({
      ...prev,
      [id]: (prev[id] || []).map(m => ({ ...m, read: true })),
    }));
  }, []);

  const sendMessage = useCallback((convId: number, text: string) => {
    const newMsg: Message = {
      id: Date.now(), from: 'doctor', text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));
  }, []);

  // Settings
  const [doctorSettings,  setDoctorSettings]  = useState<DoctorSettings>(INIT_DOCTOR_SETTINGS);
  const [patientSettings, setPatientSettings] = useState<PatientSettings>(INIT_PATIENT_SETTINGS);

  // Toggle a single doctor setting key — persists globally
  const toggleDoctorSetting = useCallback((key: keyof DoctorSettings) => {
    setDoctorSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Toggle a single patient setting key — persists globally
  const togglePatientSetting = useCallback((key: keyof PatientSettings) => {
    setPatientSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <BadgeContext.Provider value={{
      notifCount, messageCount, alertCount,
      clearNotifs, clearMessages, clearAlerts,
      alerts, respondAlert, dismissAlert,
      doctorNotifs, patientNotifs,
      markOneNotif, markAllNotifs, removeNotif,
      messages, openConv, sendMessage,
      doctorSettings, patientSettings,
      toggleDoctorSetting, togglePatientSetting,
    }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  return useContext(BadgeContext);
}
