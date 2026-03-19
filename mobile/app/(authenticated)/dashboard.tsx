import { useAuth } from "@/contexts/AuthContext";
import { Button, Text, View } from "react-native";

export default function Dashboard() {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>Dashboard</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}
