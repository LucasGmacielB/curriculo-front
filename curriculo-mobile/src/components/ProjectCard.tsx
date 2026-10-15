import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Chip, ExternalButton, Icon } from '@/components/ui';
import { palette } from '@/constants/palette';
import type { Projeto } from '@/types/portfolio';
import { safeWebUrl } from '@/utils/links';

export function ProjectCard({ project, index = 0 }: { project: Projeto; index?: number }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const imageUrl = safeWebUrl(project.imagem_url);
  const purple = index % 2 !== 0;

  return (
    <View style={styles.card}>
      {imageUrl && imageUrl !== failedUri ? (
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" onError={() => setFailedUri(imageUrl)} accessibilityLabel={`Imagem do projeto ${project.nome || ''}`} />
      ) : (
        <View style={[styles.projectCover, purple && styles.purpleCover]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={[styles.orbit, purple && styles.purpleOrbit]} />
          <View style={[styles.orbitSmall, purple && styles.purpleOrbit]} />
          <View style={[styles.coverIcon, purple && styles.purpleIcon]}><Icon name="code-working" size={32} color={purple ? palette.purple : palette.blue} /></View>
          <Text style={styles.projectNumber}>{String(index + 1).padStart(2, '0')} / PROJETO</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} accessibilityRole="header">{project.nome || 'Projeto sem nome informado'}</Text>
        <Body>{project.descricao || 'A descrição deste projeto ainda não foi informada.'}</Body>
        {project.tecnologias.length > 0 && <View style={styles.technologies}>{project.tecnologias.map((technology, technologyIndex) => <Chip key={`${technology}-${technologyIndex}`} label={technology} tone={purple ? 'purple' : 'blue'} />)}</View>}
        {project.github_url || project.deploy_url ? (
          <View style={styles.actions}>
            <ExternalButton label="GitHub" url={project.github_url} icon="logo-github" />
            <ExternalButton label="Ver demonstração" url={project.deploy_url} icon="open-outline" />
          </View>
        ) : <View style={styles.noLinks}><Icon name="link-outline" size={14} color={palette.subtle} /><Text style={styles.noLinksText}>Links ainda não informados</Text></View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, borderRadius: 22, overflow: 'hidden' },
  image: { width: '100%', aspectRatio: 1.9, backgroundColor: palette.surfaceRaised },
  projectCover: { height: 140, backgroundColor: '#12213B', borderBottomWidth: 1, borderBottomColor: '#263D60', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  purpleCover: { backgroundColor: '#211C38', borderBottomColor: '#3B3055' },
  orbit: { position: 'absolute', width: 270, height: 270, borderRadius: 135, borderWidth: 1, borderColor: '#2E466D', transform: [{ rotate: '-20deg' }, { scaleY: 0.45 }] },
  orbitSmall: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: '#2E466D', transform: [{ rotate: '35deg' }, { scaleY: 0.45 }] },
  purpleOrbit: { borderColor: '#51426C' },
  coverIcon: { width: 64, height: 64, backgroundColor: '#1D3455', borderRadius: 19, borderWidth: 1, borderColor: '#36537C', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  purpleIcon: { backgroundColor: '#34294F', borderColor: '#594573' },
  projectNumber: { position: 'absolute', bottom: 12, left: 18, color: palette.muted, fontSize: 9, letterSpacing: 2, fontWeight: '600' },
  content: { padding: 20, gap: 14 },
  name: { color: palette.text, fontSize: 22, lineHeight: 29, fontWeight: '700', letterSpacing: -0.5 },
  technologies: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingTop: 4 },
  noLinks: { flexDirection: 'row', gap: 7, alignItems: 'center', borderTopWidth: 1, borderTopColor: palette.border, paddingTop: 14, marginTop: 2 },
  noLinksText: { color: palette.subtle, fontSize: 12, flexShrink: 1 },
});
