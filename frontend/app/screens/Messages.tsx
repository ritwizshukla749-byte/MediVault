import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import DrawerLayout from '../../components/DrawerLayout';
import { useTheme } from '../../context/ThemeContext';
import { useBadges } from '../../context/BadgeContext';

const CONVERSATIONS = [
  { id:1, name:'Rahul Singh',  initials:'RS', condition:'Dengue',       time:'2 min', online:true  },
  { id:2, name:'Anita Rao',    initials:'AR', condition:'Diabetes',     time:'1 hr',  online:false },
  { id:3, name:'Vikram Patel', initials:'VP', condition:'Asthma',       time:'3 hrs', online:false },
  { id:4, name:'Priya Sharma', initials:'PS', condition:'Hypertension', time:'Yest',  online:true  },
];

type Message = { id:number; from:'patient'|'doctor'; text:string; time:string; read:boolean };

// All messages stored in state — read:false = unread/unseen
const INITIAL_MESSAGES: Record<number, Message[]> = {
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

export default function MessagesScreen() {
  const { colors } = useTheme();
  const { clearMessages } = useBadges();

  // ── Clear sidebar Messages badge when screen opens ──
  useEffect(() => { clearMessages(); }, []);

  const [activeConv, setActiveConv] = useState<number | null>(null);
  const [messages, setMessages]     = useState(INITIAL_MESSAGES);
  const [input, setInput]           = useState('');
  const scrollRef = useRef<ScrollView>(null);

  /**
   * Open a conversation AND immediately mark every patient message as read.
   * This is the core "seen" mechanic — when you come back to the list,
   * getUnread() will return 0 for this conversation.
   */
  const openConv = (id: number) => {
    setMessages(prev => ({
      ...prev,
      [id]: (prev[id] || []).map(m => ({ ...m, read: true })),
    }));
    setActiveConv(id);
  };

  /** Go back to list — messages already marked read, list shows ✓✓ */
  const goBack = () => {
    setActiveConv(null);
    setInput('');
  };

  const send = () => {
    if (!input.trim() || !activeConv) return;
    const newMsg: Message = {
      id: Date.now(), from: 'doctor',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setMessages(prev => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] || []), newMsg],
    }));
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  /**
   * Unread count = patient messages with read:false.
   * After openConv() all are marked true → returns 0 → badge disappears.
   */
  const getUnread = (id: number) =>
    (messages[id] || []).filter(m => m.from === 'patient' && !m.read).length;

  /** Last message text for the conversation preview */
  const getLastMsg = (id: number): string => {
    const thread = messages[id];
    if (!thread || thread.length === 0) return 'No messages yet';
    return thread[thread.length - 1].text;
  };

  const activePatient = CONVERSATIONS.find(c => c.id === activeConv);
  const thread        = activeConv ? (messages[activeConv] || []) : [];

  /* ── Conversation List ── */
  if (!activeConv) {
    return (
      <DrawerLayout title="Messages" subtitle="Patient communications"
        role="doctor" userName="Dr. Sharma" userInitial="DS">
        <View style={{ flex: 1, backgroundColor: colors.bgPage }}>
          {/* Search */}
          <View style={[s.searchWrap, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput
              style={[s.searchInput, { color: colors.textPrimary }]}
              placeholder="Search patients…"
              placeholderTextColor={colors.textFaint}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {CONVERSATIONS.map(conv => {
              const unreadCount = getUnread(conv.id);
              const lastMsg     = getLastMsg(conv.id);
              const hasUnread   = unreadCount > 0;

              return (
                <TouchableOpacity key={conv.id} onPress={() => openConv(conv.id)} activeOpacity={0.75}
                  style={[s.convItem, {
                    backgroundColor: colors.bgCard,
                    borderBottomColor: colors.borderSoft,
                    // Bold left border if unread
                    borderLeftColor: hasUnread ? colors.primary : 'transparent',
                    borderLeftWidth: 3,
                  }]}>

                  {/* Avatar */}
                  <View style={{ position: 'relative', flexShrink: 0 }}>
                    <View style={[s.convAvatar, {
                      backgroundColor: hasUnread ? colors.primary : colors.border,
                    }]}>
                      <Text style={{ fontSize: 13, fontWeight: '800',
                        color: hasUnread ? 'white' : colors.textMuted }}>{conv.initials}</Text>
                    </View>
                    {conv.online && (
                      <View style={[s.onlineDot, { backgroundColor: colors.success, borderColor: colors.bgCard }]} />
                    )}
                  </View>

                  {/* Text block */}
                  <View style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
                    <Text style={{ fontWeight: hasUnread ? '800' : '600', fontSize: 14,
                      color: colors.textPrimary }}>{conv.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.textFaint, marginTop: 1 }}>{conv.condition}</Text>
                    {/* Last message — bold & dark if unread, faded if read */}
                    <Text style={{
                      fontSize: 12, marginTop: 3,
                      color:      hasUnread ? colors.textPrimary : colors.textFaint,
                      fontWeight: hasUnread ? '600' : '400',
                    }} numberOfLines={1}>{lastMsg}</Text>
                  </View>

                  {/* Time + badge — fixed width, never clips */}
                  <View style={{ alignItems: 'flex-end', gap: 5, marginLeft: 10, flexShrink: 0, minWidth: 46 }}>
                    <Text style={{ fontSize: 10, color: colors.textFaint }}>{conv.time}</Text>
                    {hasUnread ? (
                      /* Red badge with count */
                      <View style={[s.unreadBadge, { backgroundColor: colors.primary }]}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>{unreadCount}</Text>
                      </View>
                    ) : (
                      /* Double blue tick = seen */
                      <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '700' }}>✓✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </DrawerLayout>
    );
  }

  /* ── Chat View ── */
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <DrawerLayout
        title={activePatient?.name || 'Chat'}
        subtitle={activePatient?.condition}
        role="doctor"
        userName="Dr. Sharma"
        userInitial="DS"
        onBack={goBack}
        headerRight={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[s.chatIconBtn, { borderColor: 'rgba(255,255,255,0.3)' }]}>
              <Text style={{ fontSize: 16 }}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.chatIconBtn, { borderColor: 'rgba(255,255,255,0.3)' }]}>
              <Text style={{ fontSize: 16 }}>📹</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <View style={{ flex: 1, backgroundColor: colors.bgPage }}>
          {/* Messages */}
          <ScrollView ref={scrollRef}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}>
            {thread.map(msg => {
              const isDoc = msg.from === 'doctor';
              return (
                <View key={msg.id} style={{ alignItems: isDoc ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <View style={[s.bubble, {
                    backgroundColor: isDoc ? colors.primary : colors.bgCard,
                    borderColor: isDoc ? 'transparent' : colors.border,
                    borderTopRightRadius: isDoc ? 4 : 18,
                    borderTopLeftRadius:  isDoc ? 18 : 4,
                  }]}>
                    <Text style={{ fontSize: 14, lineHeight: 20,
                      color: isDoc ? 'white' : colors.textPrimary }}>{msg.text}</Text>
                    {/* Time + read receipt */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
                      <Text style={{ fontSize: 10, opacity: 0.55,
                        color: isDoc ? 'white' : colors.textFaint }}>{msg.time}</Text>
                      {/* Doctor's messages show read receipt */}
                      {isDoc && (
                        <Text style={{ fontSize: 10,
                          color: msg.read ? '#86EFAC' : 'rgba(255,255,255,0.5)' }}>
                          {msg.read ? '✓✓' : '✓'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Input */}
          <View style={[s.inputBar, {
            backgroundColor: colors.bgCard, borderTopColor: colors.border,
          }]}>
            <TextInput
              style={[s.msgInput, { backgroundColor: colors.bgPage, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Type a message…"
              value={input}
              onChangeText={setInput}
              multiline
              placeholderTextColor={colors.textFaint}
            />
            <TouchableOpacity onPress={send}
              style={[s.sendBtn, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.5 }]}>
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>↑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DrawerLayout>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  convItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderLeftWidth: 3,
  },
  convAvatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6, borderWidth: 2,
  },
  unreadBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  chatIconBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  bubble: {
    maxWidth: '78%', padding: 12, borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  inputBar: {
    flexDirection: 'row', padding: 12,
    borderTopWidth: 1, gap: 10, alignItems: 'flex-end',
  },
  msgInput: {
    flex: 1, borderWidth: 1.5, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
});
