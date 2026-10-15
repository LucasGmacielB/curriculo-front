import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { ProjectCard } from '@/components/ProjectCard';
import { Screen } from '@/components/Screen';
import { ActionButton, Body, Card, Chip, Icon, Label, SectionTitle } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { palette } from '@/constants/palette';
import type { Curriculo } from '@/types/portfolio';

function HomeContent({ curriculo }: { curriculo: Curriculo }) {
  return (
    <>
      <View style={styles.intro}><Label>PORTFÓLIO PROFISSIONAL</Label><Text style={styles.introTitle}>Conheça quem está{ '\n' }por trás do código<Text style={styles.accent}>.</Text></Text></View>
      <View style={styles.hero}>
        <View style={styles.heroDecoration} pointerEvents="none" />
        <View style={styles.heroTop}><Avatar name={curriculo.nome} uri={curriculo.foto_url} size={78} /><View style={styles.heroTag}><Icon name="terminal-outline" size={14} color={palette.purple} /><Text style={styles.heroTagText}>MEU PORTFÓLIO</Text></View></View>
        <View style={styles.identity}><Text style={styles.name} accessibilityRole="header">{curriculo.nome || 'Nome não informado'}</Text>{curriculo.titulo ? <Text style={styles.role}>{curriculo.titulo}</Text> : null}</View>
        {curriculo.bio ? <Body style={styles.heroBio}>{curriculo.bio}</Body> : <Body>A apresentação deste perfil ainda não foi informada.</Body>}
        {curriculo.localizacao ? <View style={styles.location}><Icon name="location-outline" size={15} color={palette.muted} /><Text style={styles.locationText}>{curriculo.localizacao}</Text></View> : null}
        <View style={styles.heroActions}><ActionButton label="Explorar projetos" icon="arrow-forward" onPress={() => router.navigate('/projetos')} /><ActionButton label="Sobre mim" icon="person-outline" variant="secondary" onPress={() => router.navigate('/sobre')} /></View>
      </View>
      <View style={styles.stats}>
        <Stat value={curriculo.projetos.length} label="Projetos" icon="layers-outline" />
        <Stat value={curriculo.habilidades.length} label="Habilidades" icon="code-slash-outline" />
        <Stat value={curriculo.formacoes.length} label="Formações" icon="school-outline" />
      </View>
      <SectionTitle title="Explore minha trajetória" subtitle="Experiências, aprendizados e ideias em prática." />
      <View style={styles.shortcuts}>
        <Shortcut title="Formação" description="Meu percurso de aprendizado" icon="school-outline" onPress={() => router.navigate('/formacao')} />
        <Shortcut title="Experiências" description="Onde construí minha experiência" icon="briefcase-outline" onPress={() => router.navigate('/experiencias')} />
      </View>
      {curriculo.habilidades.length > 0 && <><SectionTitle title="Minha caixa de ferramentas" /><Card><View style={styles.chips}>{curriculo.habilidades.slice(0, 6).map((skill, index) => <Chip key={skill.id} label={skill.nome || 'Habilidade não informada'} tone={index % 2 === 0 ? 'blue' : 'purple'} />)}</View><ActionButton label="Ver todas as habilidades" icon="arrow-forward" variant="secondary" onPress={() => router.navigate('/sobre')} /></Card></>}
      {curriculo.projetos.length > 0 && <><SectionTitle title="Do código à prática" count={curriculo.projetos.length} subtitle="Um olhar sobre os projetos deste perfil." /><ProjectCard key={`${curriculo.id}-${curriculo.projetos[0].id}`} project={curriculo.projetos[0]} /><ActionButton label="Ver todos os projetos" icon="layers-outline" variant="secondary" onPress={() => router.navigate('/projetos')} /></>}
    </>
  );
}

function Stat({ value, label, icon }: { value: number; label: string; icon: IconName }) {
  return <View style={styles.stat}><Icon name={icon} size={18} color={palette.purple} /><Text style={styles.statNumber}>{String(value).padStart(2, '0')}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function Shortcut({ title, description, icon, onPress }: { title: string; description: string; icon: IconName; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}><View style={styles.shortcutIcon}><Icon name={icon} color={palette.blue} size={23} /></View><View style={styles.shortcutContent}><Text style={styles.shortcutTitle}>{title}</Text><Text style={styles.shortcutDescription}>{description}</Text></View><Icon name="arrow-up-right-box-outline" size={19} color={palette.subtle} /></Pressable>;
}

export default function HomeScreen() {
  return <Screen>{(curriculo) => <HomeContent curriculo={curriculo} />}</Screen>;
}

const styles = StyleSheet.create({
  intro: { gap: 14, paddingTop: 6, paddingBottom: 7 },
  introTitle: { color: palette.text, fontSize: 31, lineHeight: 39, fontWeight: '700', letterSpacing: -1.2 },
  accent: { color: palette.blue },
  hero: { backgroundColor: '#121A2C', borderWidth: 1, borderColor: '#354165', borderRadius: 26, padding: 23, gap: 21, overflow: 'hidden' },
  heroDecoration: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 40, borderColor: '#29233F', top: -100, right: -90, opacity: 0.45 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, borderWidth: 1, borderColor: '#3C335B', backgroundColor: '#25203B', padding: 8, flexShrink: 1 },
  heroTagText: { color: palette.purple, fontSize: 9, fontWeight: '600', letterSpacing: 1, flexShrink: 1 },
  identity: { gap: 10 },
  name: { color: palette.text, fontSize: 29, lineHeight: 35, letterSpacing: -0.8, fontWeight: '700' },
  role: { color: palette.blue, fontSize: 16, fontWeight: '600', lineHeight: 25 },
  heroBio: { lineHeight: 25 },
  location: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  locationText: { color: palette.muted, fontSize: 13, lineHeight: 20, flexShrink: 1 },
  heroActions: { gap: 10 },
  stats: { flexDirection: 'row', backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, borderRadius: 18, paddingVertical: 18, gap: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 7 },
  statNumber: { color: palette.text, fontSize: 25, fontWeight: '700', letterSpacing: -1 },
  statLabel: { color: palette.muted, fontSize: 11, textAlign: 'center' },
  shortcuts: { gap: 11 },
  shortcut: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, padding: 17, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 84 },
  shortcutIcon: { width: 45, height: 45, borderRadius: 13, backgroundColor: '#19283F', alignItems: 'center', justifyContent: 'center' },
  shortcutContent: { flex: 1, gap: 4 },
  shortcutTitle: { color: palette.text, fontSize: 16, fontWeight: '600' },
  shortcutDescription: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pressed: { opacity: 0.7 },
});
