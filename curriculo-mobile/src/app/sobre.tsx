import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import {
  Body,
  Card,
  Chip,
  EmptyState,
  ExternalButton,
  Icon,
  Label,
  SectionTitle,
  type IconName,
} from '@/components/ui';
import { palette } from '@/constants/palette';
import { groupSkills } from '@/utils/format';

function contactPresentation(type: string | null | undefined): {
  icon: IconName;
  kind: 'web' | 'email' | 'phone';
} {
  const normalized = type?.trim().toLowerCase() ?? '';

  if (normalized.includes('mail')) return { icon: 'mail-outline', kind: 'email' };
  if (normalized.includes('github')) return { icon: 'logo-github', kind: 'web' };
  if (normalized.includes('linkedin')) return { icon: 'logo-linkedin', kind: 'web' };
  if (normalized.includes('telefone') || normalized.includes('celular')) {
    return { icon: 'call-outline', kind: 'phone' };
  }
  if (normalized.includes('whatsapp')) return { icon: 'logo-whatsapp', kind: 'web' };

  return { icon: 'link-outline', kind: 'web' };
}

export default function SobreScreen() {
  return (
    <Screen
      eyebrow="CONHEÇA O PERFIL"
      title="Sobre mim"
      subtitle="Minha história, minhas habilidades e onde me encontrar."
    >
      {(curriculo) => (
        <>
          <Card style={styles.biographyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconTile}>
                <Icon name="person-outline" size={22} color={palette.purple} />
              </View>
              <View style={styles.headingContent}>
                <Label>PERFIL PROFISSIONAL</Label>
                <Text style={styles.name}>{curriculo.nome || 'Nome não informado'}</Text>
              </View>
            </View>

            {curriculo.titulo ? <Text style={styles.role}>{curriculo.titulo}</Text> : null}
            {curriculo.bio ? (
              <Body style={styles.biography}>{curriculo.bio}</Body>
            ) : (
              <Body>A biografia ainda não foi informada neste perfil.</Body>
            )}

            {curriculo.localizacao ? (
              <View style={styles.location}>
                <Icon name="location-outline" size={16} color={palette.blue} />
                <Text style={styles.locationText}>{curriculo.localizacao}</Text>
              </View>
            ) : null}
          </Card>

          <View style={styles.section}>
            <SectionTitle
              title="Tecnologias & habilidades"
              subtitle="Conhecimentos que fazem parte da minha trajetória."
              count={curriculo.habilidades.length}
            />
            {curriculo.habilidades.length > 0 ? (
              groupSkills(curriculo.habilidades).map((group, index) => (
                <Card key={group.category} style={styles.skillCard}>
                  <View style={styles.categoryHeader}>
                    <View
                      style={[
                        styles.categoryDot,
                        index % 2 === 0 ? styles.blueDot : styles.purpleDot,
                      ]}
                    />
                    <Text style={styles.categoryName}>{group.category}</Text>
                    <Text style={styles.categoryCount}>{group.items.length}</Text>
                  </View>
                  <View style={styles.chips}>
                    {group.items.map((skill) => (
                      <Chip
                        key={skill.id}
                        label={
                          skill.nivel
                            ? `${skill.nome || 'Habilidade não informada'} · ${skill.nivel}`
                            : skill.nome || 'Habilidade não informada'
                        }
                        tone={index % 2 === 0 ? 'blue' : 'purple'}
                      />
                    ))}
                  </View>
                </Card>
              ))
            ) : (
              <EmptyState
                icon="code-slash-outline"
                title="Habilidades ainda não informadas"
                description="As tecnologias deste perfil aparecerão aqui quando estiverem disponíveis."
              />
            )}
          </View>

          <View style={styles.section}>
            <SectionTitle
              title="Vamos conversar"
              subtitle="Contatos e links profissionais deste perfil."
            />
            {curriculo.email || curriculo.contatos.length > 0 ? (
              <Card style={styles.contactsCard}>
                {curriculo.email ? (
                  <View style={styles.contact}>
                    <Label>E-MAIL</Label>
                    <Body style={styles.contactValue}>{curriculo.email}</Body>
                    <ExternalButton
                      label="Enviar e-mail"
                      url={curriculo.email}
                      icon="mail-outline"
                      kind="email"
                    />
                  </View>
                ) : null}
                {curriculo.contatos.map((contact) => {
                  const presentation = contactPresentation(contact.tipo);

                  return (
                    <View key={contact.id} style={styles.contact}>
                      <Label>{contact.tipo || 'CONTATO'}</Label>
                      {contact.valor ? (
                        <Body style={styles.contactValue}>{contact.valor}</Body>
                      ) : null}
                      <ExternalButton
                        label={`Abrir ${contact.tipo || 'contato'}`}
                        url={contact.valor}
                        icon={presentation.icon}
                        kind={presentation.kind}
                      />
                    </View>
                  );
                })}
              </Card>
            ) : (
              <EmptyState
                icon="chatbubbles-outline"
                title="Contatos ainda não informados"
                description="Os canais de contato aparecerão aqui quando estiverem disponíveis."
              />
            )}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  biographyCard: { gap: 18, borderTopColor: palette.purple },
  cardHeader: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#241F3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContent: { flex: 1, gap: 7 },
  name: { color: palette.text, fontSize: 19, fontWeight: '700', lineHeight: 27 },
  role: { color: palette.purple, fontSize: 15, lineHeight: 23, fontWeight: '600' },
  biography: { lineHeight: 26 },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
  },
  locationText: { flex: 1, color: palette.muted, fontSize: 13, lineHeight: 20 },
  section: { gap: 12 },
  skillCard: { gap: 16 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  categoryDot: { width: 7, height: 7, borderRadius: 4 },
  blueDot: { backgroundColor: palette.blue },
  purpleDot: { backgroundColor: palette.purple },
  categoryName: { flex: 1, color: palette.text, fontSize: 15, fontWeight: '600' },
  categoryCount: { color: palette.subtle, fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  contactsCard: { gap: 24 },
  contact: { gap: 10 },
  contactValue: { fontSize: 13, lineHeight: 20 },
});
