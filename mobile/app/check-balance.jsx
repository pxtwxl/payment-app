import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { COLORS } from "@/constants/colors";
import api from "@/lib/axios";
import { useUser } from "@clerk/clerk-expo";

export default function CheckBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPin, setUserPin] = useState("");
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const fetchBalance = async () => {
    if (!email) {
      Alert.alert("Error", "No email found.");
      return;
    }
    if (!userPin || userPin.length < 4) {
      Alert.alert("Error", "Please enter your PIN.");
      return;
    }
    setBalance(null);
    setLoading(true);
    try {
      // Get userPin from backend
      const pinRes = await api.get(`http://192.168.0.24:8091/user/getPin/${encodeURIComponent(email)}`);
      const backendPin = pinRes.data;
      if (!backendPin) {
        Alert.alert("Error", "No PIN found for this user.");
        setLoading(false);
        return;
      }
      if (userPin !== backendPin.toString()) {
        Alert.alert("Error", "Incorrect PIN. Please try again.");
        setLoading(false);
        return;
      }
      // If PIN matches, fetch balance
      const balanceRes = await api.get(`http://192.168.0.24:8091/user/fetchBalance/${email}`);
      if (balanceRes.data)
        setBalance(balanceRes.data);
    } catch (err) {
      Alert.alert("Error", err?.response?.data?.message || "Failed to fetch balance.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Balance</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your PIN"
        value={userPin}
        onChangeText={setUserPin}
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
      />
      <Pressable style={styles.button} onPress={fetchBalance} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Checking..." : "Check Balance"}</Text>
      </Pressable>
      {balance !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Your Balance:</Text>
          <Text style={styles.balanceText}>₹{balance}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultBox: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 6,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
