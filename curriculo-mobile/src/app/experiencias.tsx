import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, EmptyState, Icon, Label, SectionTitle, TimelineCard } from '@/components/ui';
import { palette } from '@/constants/palette';
import { formatPeriod } from '@/utils/format';

export default function ExperienciasScreen() {
  return (
    <Screen
      eyebrow="TRAJETÓRIA"
      title="Experiências"
      subtitle="Vivências profissionais e contribuições ao longo do caminho."
    >
      {(curriculo) => (
        <>
          <Card style={styles.overview}>
            <View style={styles.iconTile}>
              <Icon name="briefcase-outline" size={26} color={palette.purple} />
            </View>
            <View style={styles.overviewContent}>
              <Label>EXPERIÊNCIA PROFISSIONAL</Label>
              <Text style={styles.overviewTitle}>
                {curriculo.experiencias.length === 1
                  ? '1 experiência cadastrada'
                  : `${curriculo.experiencias.length} experiências cadastradas`}
              </Text>
              <Text style={styles.overviewDescription}>
                Atuação, responsabilidades e aprendizados.
              </Text>
            </View>
          </Card>

          <View style={styles.section}>
            <SectionTitle title="Minha jornada profissional" count={curriculo.experiencias.length} />
            {curriculo.experiencias.length > 0 ? (
              <View>
                {curriculo.experiencias.map((experience, index) => (
                  <TimelineCard
                    key={experience.id}
                    title={experience.cargo || 'Cargo não informado'}
                    organization={experience.empresa}
                    period={formatPeriod(experience.data_inicio, experience.data_fim)}
                    description={experience.descricao}
                    isLast={index === curriculo.experiencias.length - 1}
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                icon="briefcase-outline"
                title="Experiências ainda não informadas"
                description="As experiências profissionais deste perfil aparecerão aqui quando estiverem disponíveis."
              />
            )}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  overview: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#241F3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewContent: { flex: 1, gap: 6 },
  overviewTitle: { color: palette.text, fontSize: 19, lineHeight: 27, fontWeight: '700' },
  overviewDescription: { color: palette.muted, fontSize: 13, lineHeight: 20 },
  section: { gap: 16 },
});
