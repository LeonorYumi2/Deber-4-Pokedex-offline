import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native'
import { colores } from '../../constants/theme'
import { FontGate, fuentes } from '../../components/FontGate'

export default function TabsLayout() {
  return (
    <FontGate>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colores.texto,
          tabBarInactiveTintColor: colores.textoSuave,
          tabBarLabelStyle: { fontFamily: fuentes.medium, fontSize: 12 },
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.item,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Catálogo' }} />
        <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      </Tabs>
    </FontGate>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 62,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: colores.superficie,
    borderTopColor: colores.borde,
  },
  item: {
    minHeight: 44,
  },
})
