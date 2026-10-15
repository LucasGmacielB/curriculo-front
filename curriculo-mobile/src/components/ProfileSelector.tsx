import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { ActionButton, Body, Icon, Label } from '@/components/ui';
import { palette } from '@/constants/palette';
import { usePortfolio } from '@/hooks/use-portfolio';

export function ProfileSelector() {
  const [visible, setVisible] = useState(false);
  const { pessoas, curriculo, selectedId, pendingId, isLoading, error, selectProfile, retry } = usePortfolio();

  return (
    <>
      <Pressable onPress={() => setVisible(true)} accessibilityRole="button" accessibilityLabel="Trocar perfil" style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}>
        <Avatar name={curriculo?.nome} uri={curriculo?.foto_url} size={32} />
        <Text style={styles.triggerLabel}>Trocar perfil</Text>
        <Icon name="swap-horizontal" size={17} color={palette.muted} />
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} accessibilityRole="button" accessibilityLabel="Fechar seletor de perfil" />
          <View style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.heading}>
              <View style={styles.headingText}><Label>PERFIS PROFISSIONAIS</Label><Text style={styles.title} accessibilityRole="header">Escolha um perfil</Text></View>
              <Pressable onPress={() => setVisible(false)} style={styles.close} accessibilityRole="button" accessibilityLabel="Fechar seletor de perfil"><Icon name="close" color={palette.muted} /></Pressable>
            </View>
            <Body>Explore os projetos e a trajetória de cada profissional.</Body>
            <ScrollView contentContainerStyle={styles.profiles} showsVerticalScrollIndicator={false}>
              {pessoas.map((pessoa) => {
                const selected = pessoa.id === selectedId;
                const pending = pessoa.id === pendingId && isLoading;
                return (
                  <Pressable key={pessoa.id} onPress={() => { void selectProfile(pessoa.id); }} accessibilityRole="button" accessibilityState={{ selected, busy: pending }}
                    accessibilityLabel={`Selecionar ${pessoa.nome || 'perfil'}`} style={({ pressed }) => [styles.profile, selected && styles.selectedProfile, pressed && styles.pressed]}>
                    <Avatar name={pessoa.nome} uri={pessoa.foto_url} size={48} />
                    <View style={styles.profileInfo}>
                      <Text style={styles.name}>{pessoa.nome || 'Nome não informado'}</Text>
                      {pessoa.titulo ? <Text style={styles.role}>{pessoa.titulo}</Text> : null}
                      {selected && !pending && <Text style={styles.selectedText}>Perfil selecionado</Text>}
                    </View>
                    {pending ? <ActivityIndicator color={palette.blue} /> : <Icon name={selected ? 'checkmark-circle' : 'chevron-forward'} color={selected ? palette.blue : palette.subtle} size={21} />}
                  </Pressable>
                );
              })}
              {!pessoas.length && <Body>{isLoading ? 'Buscando perfis…' : 'Nenhum perfil disponível no momento.'}</Body>}
              {error && <View style={styles.error}><Body style={{ color: palette.danger }}>{error}</Body><ActionButton label="Tentar novamente" icon="refresh-outline" onPress={() => { void retry(); }} disabled={isLoading} variant="secondary" /></View>}
            </ScrollView>
            <ActionButton label="Explorar currículo" icon="arrow-forward" onPress={() => setVisible(false)} disabled={!curriculo || isLoading} />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', gap: 8, alignItems: 'center', padding: 6, paddingRight: 10, minHeight: 48, borderWidth: 1, borderColor: palette.border, borderRadius: 14, backgroundColor: palette.surface },
  triggerLabel: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  pressed: { opacity: 0.7 },
  modalSafe: { flex: 1, justifyContent: 'center', backgroundColor: '#02050DDB', padding: 20 },
  sheet: { maxHeight: '90%', backgroundColor: palette.surface, borderColor: '#35405E', borderWidth: 1, borderRadius: 26, padding: 22, gap: 20, maxWidth: 520, width: '100%', alignSelf: 'center' },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headingText: { flex: 1, gap: 12 },
  title: { color: palette.text, fontSize: 25, fontWeight: '700', letterSpacing: -0.8 },
  close: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 14, backgroundColor: palette.surfaceRaised },
  profiles: { gap: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.background },
  selectedProfile: { borderColor: '#6288D2', backgroundColor: '#15213A' },
  profileInfo: { flex: 1, gap: 5 },
  name: { fontSize: 15, fontWeight: '700', lineHeight: 22, color: palette.text },
  role: { color: palette.muted, fontSize: 12, lineHeight: 19 },
  selectedText: { color: palette.blue, fontSize: 11, fontWeight: '600' },
  error: { gap: 12 },
});
