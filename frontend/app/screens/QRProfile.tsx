import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, RefreshControl, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../../context/ThemeContext';
import DrawerLayout from '../../components/DrawerLayout';
import QRCode from 'react-native-qrcode-svg';
import Colors from '../../constants/colors';
import { Card, CardHeader, Button } from '../../components/UI';
import { qrAPI, BASE_URL } from '../../services/api';

export default function QRProfileScreen() {
  const router = useRouter();
  const { role, userName, userInitial } = useTheme();
  const [emergencyData, setEmergencyData] = useState<{
    qrToken: string;
    url: string;
    expiresIn: string;
  } | null>(null);
  const [profileData, setProfileData] = useState<{
    qrToken: string;
    payload: { name: string; bloodType: string | null; allergies: string[] };
  } | null>(null);
  const [bloodType, setBloodType] = useState<string>('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    try {
      const [emergencyRes, profileRes] = await Promise.all([
        qrAPI.getEmergencyProfile(),
        qrAPI.getMyProfile(),
      ]);
      setEmergencyData(emergencyRes);
      setProfileData(profileRes);
      setBloodType(profileRes.payload.bloodType || 'Unknown');
      setAllergies(profileRes.payload.allergies || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load QR profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, []);

  const handleCopyLink = async () => {
    if (emergencyData?.url) {
      await Clipboard.setStringAsync(emergencyData.url);
      Alert.alert('Copied', 'Emergency QR link copied to clipboard!');
    }
  };

  const handleShare = async () => {
    if (emergencyData?.url) {
      try {
        await Share.share({
          message: `My MediVault Emergency QR Code: ${emergencyData.url}`,
          url: emergencyData.url,
          title: 'MediVault Emergency QR',
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share');
      }
    }
  };

  const emergency = [
    { label: 'Blood Type', value: bloodType || 'Unknown', icon: '🩸', highlight: false },
    { label: 'Allergies', value: allergies.length > 0 ? allergies.join(', ') : 'None', icon: '⚠️', highlight: allergies.length > 0 },
    { label: 'Emergency Contact', value: 'Not set', icon: '📞', highlight: false },
  ];

  const emergencyUrl = emergencyData?.url || `${BASE_URL}/qr/emergency/${emergencyData?.qrToken}`;

  return (
    <DrawerLayout title="Emergency QR Profile" subtitle="Your emergency health card" showBack>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}>

        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>⚠️</Text>
          <Text style={{ fontSize: 13, color: Colors.warning, flex: 1, lineHeight: 18 }}>
            This QR code can be scanned by emergency responders or doctors <Text style={{ fontWeight: '700' }}>without requiring a login</Text>. Keep it accessible.
          </Text>
        </View>

        {/* QR Card */}
        <Card>
          <CardHeader title="🔲 Your Emergency QR Code" />
          <View style={{ padding: 20, alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <>
                <View style={styles.qrBox}>
                  <QRCode
                    value={emergencyUrl}
                    size={180}
                    backgroundColor="white"
                    color={Colors.gray900}
                  />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.gray800, marginBottom: 2 }}>
                  {profileData?.payload.name || 'Patient'}
                </Text>
                <Text style={{ fontSize: 11, color: Colors.gray400, marginBottom: 4 }}>
                  Expires in: {emergencyData?.expiresIn || '30d'}
                </Text>
                <Text style={{ fontSize: 10, color: Colors.gray300, marginBottom: 16 }} selectable>
                  {emergencyUrl.substring(0, 50)}...
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Button label="📋 Copy Link" onPress={handleCopyLink} variant="outline" />
                  <Button label="🔗 Share" onPress={handleShare} />
                </View>
              </>
            )}
          </View>
        </Card>

        {/* Emergency Info */}
        <View style={[styles.card, { borderWidth: 2, borderColor: Colors.danger }]}>
          <View style={[styles.dangerHeader]}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>🚨 Emergency Information</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>No login required</Text>
          </View>
          <View style={{ padding: 16 }}>
            {emergency.map((info, i) => (
              <View key={i} style={[styles.infoRow, i < emergency.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.gray100 }]}>
                <Text style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{info.icon}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 10, color: Colors.gray400, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>{info.label}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: info.highlight ? Colors.danger : Colors.gray800 }}>{info.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Instructions */}
        <Card style={{ marginTop: 16 }}>
          <CardHeader title="📖 How to Use" />
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 12, color: Colors.gray600, lineHeight: 20 }}>
              1. Show this QR code to emergency responders{'\n'}
              2. They can scan it without logging in{'\n'}
              3. They'll see your health info and reports{'\n'}
              4. Keep this screen accessible for emergencies
            </Text>
          </View>
        </Card>

      </ScrollView>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  warningBanner: { backgroundColor: Colors.warningSoft, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: Colors.warning, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  qrBox: { width: 200, height: 200, borderRadius: 14, borderWidth: 3, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, marginBottom: 14, padding: 10 },
  card: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', marginBottom: 0, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  dangerHeader: { backgroundColor: Colors.danger, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
});

import { StyleSheet } from 'react-native';
