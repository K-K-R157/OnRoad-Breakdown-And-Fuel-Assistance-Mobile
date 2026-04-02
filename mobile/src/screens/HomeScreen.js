import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FEATURES = [
  {
    icon: "locate-outline",
    title: "Live GPS Tracking",
    description: "Track mechanic, fuel, and EV support in real time.",
  },
  {
    icon: "flash-outline",
    title: "Fast Response",
    description: "Quick assignment to nearby verified providers.",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Trusted Network",
    description: "Admin-approved stations and mechanics only.",
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <View style={styles.logoCircle}>
              <Ionicons name="car-sport-outline" size={20} color="#062f3d" />
            </View>
            <Text style={styles.brand}>OnRoad Mobile</Text>
          </View>

          <Text style={styles.title}>Roadside help when you need it most</Text>
          <Text style={styles.subtitle}>
            Breakdowns, fuel delivery, and EV charging assistance in one app.
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Auth", { mode: "login" })}
            >
              <Text style={styles.primaryText}>Login</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Auth", { mode: "signup" })}
            >
              <Text style={styles.secondaryText}>Signup</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What this app offers</Text>
        {FEATURES.map((item) => (
          <View key={item.title} style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={20} color="#35d0ff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a1014" },
  container: { padding: 16, paddingBottom: 28 },
  hero: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a4a59",
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#35d0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: "#d2f6ff", fontWeight: "700", fontSize: 15 },
  title: {
    color: "#f4fbff",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginTop: 14,
  },
  subtitle: {
    color: "#b7d0dc",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  primaryButton: {
    flex: 1,
    backgroundColor: "#35d0ff",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryText: { color: "#082b3a", fontWeight: "700" },
  secondaryButton: {
    flex: 1,
    borderColor: "#6ab2cb",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#10303e",
  },
  secondaryText: { color: "#bce9ff", fontWeight: "700" },
  sectionTitle: {
    color: "#f4fbff",
    marginTop: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#223542",
    borderRadius: 14,
    backgroundColor: "#111b21",
    padding: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#12303d",
  },
  cardContent: { flex: 1 },
  cardTitle: { color: "#e8f4f9", fontWeight: "700", fontSize: 14 },
  cardDescription: {
    color: "#9eb2be",
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
});
