import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import DrawerLayout from '../../components/DrawerLayout';
import { useTheme } from '../../context/ThemeContext';
import { useBadges } from '../../context/BadgeContext';
import { Badge, Button } from '../../components/UI';

const DOCTOR_NOTIFS = [
  { id:1, icon:'🚨', title:'Critical: Rahul Singh',      body:'High fever 104°F — immediate attention required.',          time:'2 min ago',  read:false, tag:'Critical'  },
  { id:2, icon:'⚠️', title:'Missed Doses: Vikram Patel', body:'3 consecutive Antibiotic doses missed. Caregiver notified.', time:'18 min ago', read:false, tag:'Adherence' },
  { id:3, icon:'📋', title:'New Report: Anita Rao',      body:'Blood Test uploaded. AI summary ready for review.',          time:'1 hr ago',   read:false, tag:'Report'    },
  { id:4, icon:'📱', title:'SMS Delivered',              body:'Your SMS to Rahul Singh was delivered via Twilio.',           time:'2 hrs ago',  read:true,  tag:'SMS'       },
  { id:5, icon:'🤖', title:'AI Summary Ready',           body:'Chest X-Ray analysed for Priya Sharma. No abnormalities.',   time:'3 hrs ago',  read:true,  tag:'AI'        },
  { id:6, icon:'💊', title:'Prescription Updated',       body:"Vitamin D3 added to Rahul Singh's prescription.",            time:'5 hrs ago',  read:true,  tag:'Medicine'  },
];

const PATIENT_NOTIFS = [
  { id:1, icon:'💊', title:'Take Paracetamol 500mg',    body:'Your 8:00 AM dose is due. Tap to mark as taken.',            time:'Just now',   read:false, tag:'Medicine' },
  { id:2, icon:'🤖', title:'AI Report Summary Ready',   body:'Your Blood Test has been analysed. View summary.',           time:'10 min ago', read:false, tag:'AI'       },
  { id:3, icon:'💬', title:'Dr. Meera Kapoor',          body:'Take rest and keep drinking fluids. Check tomorrow.',         time:'1 hr ago',   read:false, tag:'Message'  },
  { id:4, icon:'🔥', title:'7-Day Streak! 🎉',          body:'Amazing! 7 days of perfect medication adherence!',           time:'3 hrs ago',  read:true,  tag:'Streak'   },
  { id:5, icon:'📋', title:'New Record Added',          body:'Dr. Kapoor added an OPD visit to your health timeline.',     time:'Yesterday',  read:true,  tag:'Record'   },
  { id:6, icon:'🔲', title:'QR Profile Updated',        body:'Emergency QR regenerated with updated medication details.',   time:'Yesterday',  read:true,  tag:'System'   },
];

const TAG_COLORS: Record<string, 'danger'|'warning'|'primary'|'success'|'teal'|'default'> = {
  Critical:'danger', Adherence:'warning', Report:'primary', SMS:'teal',
  AI:'teal', Medicine:'success', Message:'primary', Streak:'success',
  Record:'primary', System:'default',
};

export default function NotificationsScreen() {
  const { colors, isDark, role } = useTheme();
  const { clearNotifs } = useBadges();

  // ── Clear sidebar badge as soon as user opens this screen ──
  useEffect(() => { clearNotifs(); }, []);
  const isDoctor  = role === 'doctor';
  const BASE      = isDoctor ? DOCTOR_NOTIFS : PATIENT_NOTIFS;
  const accent    = isDoctor ? colors.primary : colors.teal;

  const [notifs, setNotifs] = useState(BASE);
  const [filter, setFilter] = useState('All');

  const unread  = notifs.filter(n => !n.read).length;
  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const markOne = (id: number) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const remove  = (id: number) => setNotifs(p => p.filter(n => n.id !== id));

  // ── Only show 3 filters max to prevent overflow ──
  const filters = isDoctor
    ? ['All', 'Unread', 'Critical', 'Report']
    : ['All', 'Unread', 'Medicine', 'Message'];

  const displayed = notifs.filter(n => {
    if (filter === 'All')    return true;
    if (filter === 'Unread') return !n.read;
    return n.tag === filter;
  });

  return (
    <DrawerLayout
      title="Notifications"
      subtitle={unread > 0 ? `${unread} unread` : 'All caught up!'}
      role={role}
      userName={isDoctor ? 'Dr. Sharma' : 'Rahul Singh'}
      userInitial={isDoctor ? 'DS' : 'RS'}
      headerRight={
        unread > 0
          ? <Button label="Mark all" onPress={markAll} size="sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }} />
          : undefined
      }
    >
      <View style={{ flex: 1, backgroundColor: colors.bgPage }}>

        {/* ── Role Banner ── */}
        <View style={[s.banner, {
          backgroundColor: isDoctor
            ? (isDark ? '#1a2d5a' : '#EFF6FF')
            : (isDark ? '#052e2e' : '#F0FDFA'),
          borderColor: accent + '40',
        }]}>
          <Text style={{ fontSize: 22 }}>{isDoctor ? '👨‍⚕️' : '🧑'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.bannerTitle, { color: accent }]}>
              {isDoctor ? 'Doctor Notifications' : 'Patient Notifications'}
            </Text>
            <Text style={[s.bannerSub, { color: colors.textMuted }]}>
              {isDoctor ? 'Patient alerts & system updates' : 'Medications, messages & updates'}
            </Text>
          </View>
          {unread > 0 && (
            <View style={[s.unreadBubble, { backgroundColor: accent }]}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>{unread}</Text>
            </View>
          )}
        </View>

        {/* ── Filter Pills — horizontal scroll, no overflow ── */}
        <View style={[s.filterWrap, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
            {filters.map(f => {
              const active = filter === f;
              return (
                <TouchableOpacity key={f} onPress={() => setFilter(f)}
                  style={[s.filterBtn, {
                    backgroundColor: active ? accent : colors.bgPage,
                    borderColor: active ? accent : colors.border,
                  }]}>
                  <Text style={[s.filterTxt, { color: active ? 'white' : colors.textMuted }]}>
                    {f}
                  </Text>
                  {f === 'Unread' && unread > 0 && (
                    <View style={[s.filterCount, { backgroundColor: active ? 'rgba(255,255,255,0.3)' : '#FF4444' }]}>
                      <Text style={{ fontSize: 9, fontWeight: '900', color: 'white' }}>{unread}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Notification List ── */}
        <ScrollView contentContainerStyle={{ padding: 14, gap: 10, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>

          {displayed.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 50 }}>🎉</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 12 }}>All caught up!</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>No notifications here.</Text>
            </View>
          )}

          {displayed.map(n => (
            <View key={n.id} style={[s.card, {
              // ── Read vs Unread styling ──
              backgroundColor: n.read
                ? colors.bgCard
                : isDoctor ? (isDark ? '#1a2540' : '#EFF6FF') : (isDark ? '#052e2e' : '#F0FDFA'),
              borderColor:     n.read ? colors.border : accent + '40',
              borderLeftColor: n.read ? colors.border : accent,
              // Unread has slightly stronger shadow
              shadowOpacity: n.read ? 0.04 : 0.1,
            }]}>
              {/* Unread dot — hidden when read */}
              <View style={[s.dot, {
                backgroundColor: n.read ? 'transparent' : accent,
              }]} />

              {/* Icon box */}
              <View style={[s.iconBox, {
                backgroundColor: n.read ? colors.bgCardHover : accent + '18',
                borderColor: n.read ? colors.border : accent + '40',
              }]}>
                <Text style={{ fontSize: 20 }}>{n.icon}</Text>
              </View>

              {/* Text content */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                  {/* Title bold when unread, muted when read */}
                  <Text style={[s.notifTitle, {
                    color: n.read ? colors.textMuted : colors.textPrimary,
                    fontWeight: n.read ? '500' : '700',
                  }]} numberOfLines={1}>{n.title}</Text>
                  <Badge label={n.tag} type={TAG_COLORS[n.tag] || 'primary'} />
                </View>
                <Text style={[s.notifBody, { color: n.read ? colors.textFaint : colors.textMuted }]}
                  numberOfLines={2}>{n.body}</Text>
                <Text style={[s.notifTime, { color: colors.textFaint }]}>🕐 {n.time}</Text>
              </View>

              {/* Action buttons */}
              <View style={{ gap: 6, flexShrink: 0 }}>
                {/* Only show ✓ tick if unread */}
                {!n.read && (
                  <TouchableOpacity onPress={() => markOne(n.id)}
                    style={[s.actionBtn, { backgroundColor: colors.successSoft, borderColor: colors.success + '40' }]}>
                    <Text style={{ color: colors.success, fontSize: 14, fontWeight: '800' }}>✓</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => remove(n.id)}
                  style={[s.actionBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                  <Text style={{ color: colors.textFaint, fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </DrawerLayout>
  );
}

const s = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    margin: 14, padding: 14, borderRadius: 14, borderWidth: 1,
  },
  bannerTitle: { fontSize: 14, fontWeight: '800' },
  bannerSub:   { fontSize: 11, marginTop: 2 },
  unreadBubble: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  filterWrap: { borderBottomWidth: 1 },
  filterBtn: {
    paddingVertical: 7, paddingHorizontal: 16,
    borderRadius: 20, borderWidth: 1.5,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  filterTxt: { fontSize: 12, fontWeight: '600' },
  filterCount: {
    minWidth: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  card: {
    borderRadius: 16, padding: 14,
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    borderWidth: 1, borderLeftWidth: 4,
    shadowColor: '#000', shadowRadius: 6, elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  iconBox: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  notifTitle: { fontSize: 13 },
  notifBody:  { fontSize: 12, lineHeight: 17, marginBottom: 4 },
  notifTime:  { fontSize: 11 },
  actionBtn: {
    width: 30, height: 30, borderRadius: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
});
