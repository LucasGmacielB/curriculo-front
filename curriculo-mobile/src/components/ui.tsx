import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { palette } from '@/constants/palette';
import { safeExternalUrl } from '@/utils/links';
import type { LinkKind } from '@/utils/links';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 22, color = palette.blue }: { name: IconName; size?: number; color?: ComponentProps<typeof Ionicons>['color'] }) {
  return <Ionicons name={name} size={size} color={color} accessible={false} />;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children }: PropsWithChildren) {
  return <Text style={styles.label}>{children}</Text>;
}

export function Body({ children, style }: PropsWithChildren<{ style?: StyleProp<TextStyle> }>) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function SectionTitle({ title, subtitle, count }: { title: string; subtitle?: string; count?: number }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle} accessibilityRole="header">{title}</Text>
        {count !== undefined && <Text style={styles.count}>{String(count).padStart(2, '0')}</Text>}
      </View>
      {subtitle ? <Body>{subtitle}</Body> : null}
    </View>
  );
}

export function Chip({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'purple' | 'neutral' }) {
  return (
    <View style={[styles.chip, tone === 'purple' && styles.purpleChip, tone === 'neutral' && styles.neutralChip]}>
      <Text style={[styles.chipText, tone === 'purple' && { color: palette.purple }, tone === 'neutral' && { color: palette.muted }]}>{label}</Text>
    </View>
  );
}

export function ActionButton({ label, icon, onPress, variant = 'primary', disabled = false }: {
  label: string; icon?: IconName; onPress: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, variant === 'secondary' && styles.secondaryButton, disabled && styles.disabled, pressed && styles.pressed]}>
      {icon && <Icon name={icon} size={18} color={variant === 'primary' ? palette.background : palette.blue} />}
      <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryButtonText]}>{label}</Text>
    </Pressable>
  );
}

export function ExternalButton({ label, url, icon = 'open-outline', kind = 'web' }: {
  label: string; url?: string | null; icon?: IconName; kind?: LinkKind;
}) {
  if (!url) return null;
  const safeUrl = safeExternalUrl(url, kind);
  async function open() {
    if (!safeUrl) return;
    try {
      await Linking.openURL(safeUrl);
    } catch {
      Alert.alert('Não foi possível abrir o link', 'Verifique se há um aplicativo disponível para abrir este endereço e tente novamente.');
    }
  }
  return <ActionButton label={safeUrl ? label : `${label} · link inválido`} icon={icon} onPress={() => { void open(); }} variant="secondary" disabled={!safeUrl} />;
}

export function EmptyState({ title, description, icon = 'layers-outline' }: { title: string; description: string; icon?: IconName }) {
  return (
    <Card style={styles.empty}>
      <View style={styles.emptyIcon}><Icon name={icon} size={28} color={palette.purple} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Body style={styles.centered}>{description}</Body>
    </Card>
  );
}

export function TimelineCard({ title, organization, period, description, badge, isLast = false }: {
  title: string; organization?: string | null; period: string; description?: string | null; badge?: string | null; isLast?: boolean;
}) {
  return (
    <View style={styles.timeline}>
      <View style={styles.rail}>
        <View style={styles.dot}><View style={styles.dotInner} /></View>
        {!isLast && <View style={styles.line} />}
      </View>
      <Card style={styles.timelineCard}>
        {badge ? <View style={styles.badgeRow}><Chip label={badge} tone="purple" /></View> : null}
        <Text style={styles.timelineTitle} accessibilityRole="header">{title}</Text>
        {organization ? <Text style={styles.organization}>{organization}</Text> : null}
        <View style={styles.period}><Icon name="calendar-outline" size={14} color={palette.subtle} /><Text style={styles.periodText}>{period}</Text></View>
        {description ? <Body>{description}</Body> : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 22, padding: 20, gap: 14 },
  label: { color: palette.blue, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  body: { color: palette.muted, fontSize: 15, lineHeight: 24 },
  section: { gap: 6, marginTop: 10 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitle: { color: palette.text, fontSize: 21, fontWeight: '700', flexShrink: 1, letterSpacing: -0.5 },
  count: { color: palette.purple, fontSize: 12, fontWeight: '700', backgroundColor: '#211D38', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  chip: { backgroundColor: '#172743', borderColor: '#294167', borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  purpleChip: { backgroundColor: '#231F39', borderColor: '#3A3158' },
  neutralChip: { backgroundColor: palette.surfaceRaised, borderColor: palette.border },
  chipText: { color: palette.blue, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  button: { minHeight: 48, borderRadius: 13, paddingHorizontal: 17, paddingVertical: 12, backgroundColor: palette.blue, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' },
  secondaryButton: { backgroundColor: '#17233B', borderColor: '#2C4064', borderWidth: 1 },
  buttonText: { color: palette.background, fontSize: 14, fontWeight: '700', flexShrink: 1 },
  secondaryButtonText: { color: palette.blue },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  empty: { alignItems: 'center', paddingVertical: 34 },
  emptyIcon: { padding: 15, borderRadius: 18, backgroundColor: '#231F39' },
  emptyTitle: { color: palette.text, fontSize: 18, textAlign: 'center', fontWeight: '600' },
  centered: { textAlign: 'center' },
  timeline: { flexDirection: 'row', gap: 13 },
  rail: { alignItems: 'center', width: 18 },
  dot: { width: 18, height: 18, borderColor: '#4F4683', borderWidth: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 22, backgroundColor: '#231F39' },
  dotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.purple },
  line: { flex: 1, width: 1, backgroundColor: palette.border, marginTop: 7, marginBottom: -34 },
  timelineCard: { flex: 1, marginBottom: 18 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap' },
  timelineTitle: { color: palette.text, fontSize: 20, lineHeight: 27, fontWeight: '700' },
  organization: { color: palette.blue, fontSize: 15, lineHeight: 23, fontWeight: '500' },
  period: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  periodText: { color: palette.subtle, fontSize: 12, lineHeight: 19, flexShrink: 1 },
});
