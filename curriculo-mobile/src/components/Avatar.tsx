import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { initials } from '@/utils/format';
import { safeWebUrl } from '@/utils/links';

export function Avatar({ name, uri, size = 50 }: { name?: string | null; uri?: string | null; size?: number }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const url = safeWebUrl(uri);
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size * 0.3 }]} accessibilityLabel={name ? `Perfil de ${name}` : 'Perfil'}>
      {url && url !== failedUri ? (
        <Image source={{ uri: url }} style={StyleSheet.absoluteFill} contentFit="cover" onError={() => setFailedUri(url)} accessibilityLabel={name ? `Foto de ${name}` : 'Foto de perfil'} />
      ) : <Text style={[styles.initials, { fontSize: size * 0.33 }]}>{initials(name)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: '#242442', borderWidth: 1, borderColor: '#46416B', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { color: '#D0C2FF', fontWeight: '700', letterSpacing: -1 },
});
