import { StyleSheet, Text, View } from 'react-native';

import { ProjectCard } from '@/components/ProjectCard';
import { Screen } from '@/components/Screen';
import { EmptyState, Icon } from '@/components/ui';
import { palette } from '@/constants/palette';

export default function ProjetosScreen() {
  return (
    <Screen eyebrow="IDEIAS EM MOVIMENTO" title="Projetos" subtitle="Soluções construídas com curiosidade, tecnologia e propósito.">
      {(curriculo) => curriculo.projetos.length > 0 ? (
        <>
          <View style={styles.summary}><View style={styles.summaryIcon}><Icon name="layers-outline" size={22} color={palette.purple} /></View><View style={styles.summaryContent}><Text style={styles.summaryTitle}>{curriculo.projetos.length} {curriculo.projetos.length === 1 ? 'projeto no portfólio' : 'projetos no portfólio'}</Text><Text style={styles.summaryText}>{curriculo.nome || 'Perfil selecionado'}</Text></View></View>
          {curriculo.projetos.map((project, index) => <ProjectCard key={`${curriculo.id}-${project.id}`} project={project} index={index} />)}
        </>
      ) : <EmptyState title="Novos projetos a caminho" description="Este perfil ainda não possui projetos cadastrados." icon="code-working-outline" />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 17, borderRadius: 17, borderWidth: 1, borderColor: '#373051', backgroundColor: '#1B192F', marginBottom: 4 },
  summaryIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#2B2444', alignItems: 'center', justifyContent: 'center' },
  summaryContent: { flex: 1, gap: 4 },
  summaryTitle: { color: palette.text, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  summaryText: { color: palette.muted, fontSize: 12, lineHeight: 19 },
});
