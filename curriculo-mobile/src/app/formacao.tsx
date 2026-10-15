import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card, EmptyState, Icon, Label, SectionTitle, TimelineCard } from '@/components/ui';
import { palette } from '@/constants/palette';
import { formatPeriod } from '@/utils/format';

export default function FormacaoScreen() {
  return (
    <Screen
      eyebrow="TRAJETÓRIA"
      title="Formação acadêmica"
      subtitle="Conhecimento que se transforma em prática."
    >
      {(curriculo) => (
        <>
          <Card style={styles.overview}>
            <View style={styles.iconTile}>
              <Icon name="school-outline" size={26} color={palette.blue} />
            </View>
            <View style={styles.overviewContent}>
              <Label>APRENDIZADO</Label>
              <Text style={styles.overviewTitle}>
                {curriculo.formacoes.length === 1
                  ? '1 formação cadastrada'
                  : `${curriculo.formacoes.length} formações cadastradas`}
              </Text>
              <Text style={styles.overviewDescription}>
                Formação e desenvolvimento profissional.
              </Text>
            </View>
          </Card>

          <View style={styles.section}>
            <SectionTitle title="Minha jornada de estudos" count={curriculo.formacoes.length} />
            {curriculo.formacoes.length > 0 ? (
              <View>
                {curriculo.formacoes.map((education, index) => (
                  <TimelineCard
                    key={education.id}
                    title={education.curso || 'Curso não informado'}
                    organization={education.instituicao}
                    badge={education.tipo}
                    period={formatPeriod(education.data_inicio, education.data_fim)}
                    description={education.descricao}
                    isLast={index === curriculo.formacoes.length - 1}
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                icon="school-outline"
                title="Formação ainda não informada"
                description="Os cursos e as instituições deste perfil aparecerão aqui quando estiverem disponíveis."
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
    backgroundColor: '#1B2C4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewContent: { flex: 1, gap: 6 },
  overviewTitle: { color: palette.text, fontSize: 19, lineHeight: 27, fontWeight: '700' },
  overviewDescription: { color: palette.muted, fontSize: 13, lineHeight: 20 },
  section: { gap: 16 },
});
