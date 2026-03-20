import { Button } from "@/components/Button";
import Input from "@/components/Input";
import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Please fill your email and password!");
      return;
    }
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace("/(authenticated)/dashboard");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Error while signing in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoSubtitle}>Waiter App</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Your email address..."
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label="Password"
            placeholder="Your password..."
            placeholderTextColor={colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Log in" loading={loading} onPress={handleLogin} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
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
  logoSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray,
  },
  formContainer: {
    gap: spacing.lg,
  },
});
