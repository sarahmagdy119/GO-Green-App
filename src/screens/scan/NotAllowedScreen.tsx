import MainHeader from '@/components/common/MainHeader';
import { Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AreaListItem from '../../components/scan/AreaListItem';
import { useTranslation } from '../../i18n/LanguageContext';
import { useScanStore } from '../../store/scan.store';

export default function NotAllowedScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const result = useScanStore((s) => s.result);

  const areas = result?.allowedAreas ?? [];
  const visibleAreas = areas.slice(0, 3);
  const hasMore = areas.length > 3;

  const handleBackToScan = () => router.replace('/');

  return (
    <ScrollView style={styles.container}>
      <MainHeader />

      <View style={styles.content}>
        <View style={styles.notAllowedBox}>
          <View style={styles.iconWrap}>
            <Ionicons name="ban-outline" size={40} color="#B23A3A" />
          </View>
          <Text style={styles.notAllowedText}>{t('scan.notAllowed')}</Text>
          <View style={styles.notAllowedUnderline} />
        </View>

        <Pressable style={styles.backButton} onPress={handleBackToScan}>
          <Text style={styles.backButtonText}>{t('scan.backToScan')}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>{t('scan.accessibleAreas')}</Text>

        {visibleAreas.map((area) => (
          <AreaListItem key={area.id} area={area} />
        ))}

        {hasMore && (
          <Pressable style={styles.viewMore}>
            <Text style={styles.viewMoreText}>{t('scan.viewMore')}</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff'  },
  content: { alignItems: 'center' , marginTop: '55%'},
  notAllowedBox: {
    width: 290,
    height: 190,  
    borderWidth: 3.5,
    borderColor: '#B23A3A',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    marginTop: 24,
    marginBottom: 20,

  },
iconWrap: {
  width: 64,
  height: 64,
  borderRadius: 32,
  borderWidth: 3.5,
  borderColor: '#B23A3A',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,

  boxShadow: '0px 0px 8px 2px rgba(178, 58, 58, 0.45)',
},
  notAllowedText: { fontSize: 36,  color: '#B23A3A' , fontFamily: Fonts.heading ,},
  backButton: {
    backgroundColor: '#16233f',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 24,
  },
    notAllowedUnderline: { width: 150, height: 1.2, backgroundColor: '#B23A3A', marginTop: 4 },

  backButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600', fontFamily: Fonts.body },
  sectionTitle: {fontSize: 19, color: '#16233f', alignSelf: 'center', marginBottom: 19, fontFamily: Fonts.heading },
  viewMore: {
    borderWidth: 1,
    borderColor: '#c9a25a',
    borderRadius: 10,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  viewMoreText: { color: '#c9a25a', fontSize: 12, fontWeight: '600' },
});