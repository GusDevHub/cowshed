import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Dashboard() {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
            <TouchableOpacity style={styles.signoutButton}>
              <Text style={styles.signoutText}>Log out</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>New order</Text>
            <Input
              placeholder="Table number"
              style={styles.input}
              placeholderTextColor={colors.gray}
            />
            <Button title="Assign table" onPress={() => {}} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  signoutButton: {
    backgroundColor: colors.gray,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  signoutText: {
    color: colors.primary,
    fontSize: fontSize.md,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 180,
    height: 100,
  },
  title: {
    fontSize: fontSize.xl,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
});
