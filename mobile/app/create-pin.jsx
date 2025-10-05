// app/create-pin.js
import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@/lib/axios";

export default function CreatePin() {
  const [existingPin, setExistingPin] = useState(null);
  const [step, setStep] = useState("check");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const init = async () => {
      try {
        if (!email) return;
        const res = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/user/getPin/${encodeURIComponent(email)}`);
        const serverPin = res?.data;
        if (serverPin) {
          setExistingPin(String(serverPin));
          setStep("verify");
        } else {
          setStep("new");
        }
      } catch (e) {
        Alert.alert("Error", "Unable to verify account status.");
      }
    };
    init();
  }, [email]);

  const handleVerifyPin = () => {
    if (pin === existingPin) {
      setStep("new");
      setPin("");
    } else {
      Alert.alert("Error", "Incorrect PIN. Try again.");
    }
  };

  const handleSetNewPin = async () => {
    if (newPin.length < 4) {
      Alert.alert("Error", "PIN must be at least 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Error", "PINs do not match.");
      return;
    }
    try {
      if (!email) {
        Alert.alert("Error", "No user email found.");
        return;
      }
      const newPinCode = parseInt(newPin, 10);
      const resp = await api.post(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/user/createPin/${encodeURIComponent(email)}/${newPinCode}`);
      if (resp.status >= 400) {
        console.log("Create PIN error:", resp.status, resp.data);
        Alert.alert("Error", typeof resp.data === 'string' ? resp.data : "Failed to set PIN.");
        return;
      }
      Alert.alert("Success", "PIN has been set successfully.");
      router.back();
    } catch (e) {
      console.log("Create PIN exception:", e?.response?.status, e?.response?.data, e?.message);
      const message = e?.response?.data || e?.message || "Failed to set PIN.";
      Alert.alert("Error", String(message));
    }
  };

  return (
    <View style={styles.container}>
      {step === "verify" && (
        <>
          <Text style={styles.title}>Enter Current PIN</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            value={pin}
            onChangeText={setPin}
          />
          <Pressable style={styles.button} onPress={handleVerifyPin}>
            <Text style={styles.buttonText}>Verify</Text>
          </Pressable>
        </>
      )}

      {step === "new" && (
        <>
          <Text style={styles.title}>Set New PIN</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            placeholder="Enter new PIN"
            value={newPin}
            onChangeText={setNewPin}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
            placeholder="Confirm new PIN"
            value={confirmPin}
            onChangeText={setConfirmPin}
          />
          <Pressable style={styles.button} onPress={handleSetNewPin}>
            <Text style={styles.buttonText}>Save PIN</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.text,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: COLORS.card,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
