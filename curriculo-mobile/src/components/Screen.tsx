import type { ReactNode } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileSelector } from '@/components/ProfileSelector';
import { ActionButton, Body, Card, Icon, Label } from '@/components/ui';
import { palette } from '@/constants/palette';
import { usePortfolio } from '@/hooks/use-portfolio';
import type { Curriculo } from '@/types/portfolio';

export function Screen({ title, subtitle, eyebrow, children }: {
  title?: string; subtitle?: string; eyebrow?: string; children: (curriculo: Curriculo) => ReactNode;
}) {
  const { curriculo, selectedId, pendingId, pessoas, isLoading, isRefreshing, error, retry, refresh } = usePortfolio();
  const pendingName = pessoas.find((pessoa) => pessoa.id === pendingId)?.nome;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.brand}><View style={styles.brandIcon}><Icon name="code-slash" size={21} color={palette.purple} /></View><Text style={styles.brandName}>dev<Text style={styles.brandAccent}>.fólio</Text></Text></View>
        <ProfileSelector />
      </View>
      {isLoading ? (
        <View style={styles.state} accessibilityLiveRegion="polite" accessibilityLabel="Carregando currículo">
          <View style={styles.loadingIcon}><ActivityIndicator size="large" color={palette.blue} /></View>
          <Text style={styles.stateTitle}>{curriculo ? 'Trocando de perspectiva' : 'Carregando portfólios'}</Text>
          <Body style={styles.center}>{pendingName ? `Buscando o currículo de ${pendingName}…` : 'Preparando projetos, habilidades e trajetórias…'}</Body>
        </View>
      ) : !curriculo ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <View style={styles.loadingIcon}><Icon name={error ? 'cloud-offline-outline' : 'people-outline'} size={34} color={palette.purple} /></View>
          <Text style={styles.stateTitle}>{error ? 'Vamos tentar de novo?' : 'Nenhum perfil disponível'}</Text>
          <Body style={styles.center}>{error || 'Os currículos aparecerão aqui quando houver pessoas cadastradas.'}</Body>
          <ActionButton label="Tentar novamente" icon="refresh-outline" onPress={() => { void retry(); }} />
        </View>
      ) : (
        <ScrollView key={selectedId} style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => { void refresh(); }} tintColor={palette.blue} colors={[palette.blue]} progressBackgroundColor={palette.surface} />}>
          {error && <Card style={styles.error}><View style={styles.errorHeading}><Icon name="alert-circle-outline" size={19} color={palette.danger} /><Text style={styles.errorTitle}>Não foi possível atualizar</Text></View><Body style={{ color: palette.danger }}>{error}</Body><Body>Exibindo o último currículo carregado: {curriculo.nome || 'perfil selecionado'}.</Body><ActionButton label="Tentar novamente" icon="refresh-outline" variant="secondary" onPress={() => { void retry(); }} /></Card>}
          {title && <View style={styles.pageHeading}>{eyebrow && <Label>{eyebrow}</Label>}<Text style={styles.title} accessibilityRole="header">{title}</Text>{subtitle && <Body>{subtitle}</Body>}</View>}
          {children(curriculo)}
          <View style={styles.footer}><View style={styles.footerLine} /><Text style={styles.footerText}>TRAJETÓRIAS QUE SE CONECTAM.</Text></View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  header: { width: '100%', maxWidth: 808, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  brandIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 11, backgroundColor: '#221E36', borderWidth: 1, borderColor: '#393152' },
  brandName: { fontSize: 20, color: palette.text, fontWeight: '700', letterSpacing: -0.8 },
  brandAccent: { color: palette.purple },
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 808, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, gap: 18 },
  pageHeading: { gap: 12, paddingTop: 10, paddingBottom: 6 },
  title: { color: palette.text, fontSize: 32, lineHeight: 39, fontWeight: '700', letterSpacing: -1.2 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 20, maxWidth: 520, alignSelf: 'center', width: '100%' },
  loadingIcon: { height: 84, width: 84, borderRadius: 26, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stateTitle: { color: palette.text, fontSize: 23, fontWeight: '700', textAlign: 'center', letterSpacing: -0.6 },
  center: { textAlign: 'center' },
  error: { borderColor: '#65404B', backgroundColor: '#241A27' },
  errorHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  errorTitle: { color: palette.danger, fontWeight: '700', fontSize: 15, flexShrink: 1 },
  footer: { gap: 18, paddingTop: 20, paddingBottom: 10 },
  footerLine: { backgroundColor: palette.border, height: 1 },
  footerText: { color: palette.subtle, fontSize: 9, letterSpacing: 2, textAlign: 'center' },
});
