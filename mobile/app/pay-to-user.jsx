import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles as istyles } from "@/assets/styles/auth.styles.js";
import { useRouter } from "expo-router";
import api from "@/lib/axios";
import { useUser } from "@clerk/clerk-expo";

export default function PayToUser() {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const email = useUser()?.user?.primaryEmailAddress?.emailAddress;

  const handleProceed = () => {
    if (!verified) {
    Alert.alert("Please verify before proceeding")
    return
    }
    router.push({ pathname: "/pay", params: { upiId: method === "upi" ? upiId : phone } })
  };

  const handleVerify = async () => {
    setVerified(false);
    if (method === "upi") {
      try {
        const res = await api.get(`http://192.168.0.24:8091/user/validate/${encodeURIComponent(upiId)}`);
        if (res.data) {
          setVerified(true);
          Alert.alert("Verified", "UPI ID exists and is connected to a bank account.");
        } else {
          setVerified(false);
          Alert.alert("Not Verified", "UPI ID does not exist.");
        }
      } catch (err) {
        setVerified(false);
        Alert.alert("Error", err?.response?.data?.message || "Failed to verify UPI ID.");
      }
      setVerifying(false);
      return;
    }
    // Phone verification remains local
    setTimeout(() => {
      if (phone.match(/^\d{10}$/)) {
        setVerified(true);
        Alert.alert("Verified", "Phone number format is valid.");
      } else {
        setVerified(false);
        Alert.alert("Not Verified", "Please enter a valid phone number.");
      }
      setVerifying(false);
    }, 800);
  };

  return (
    <View style={istyles.container}>
      <Text style={istyles.title}>Pay to User</Text>
      <View style={styles.switchRow}>
        <Pressable
          style={[styles.switchButton, method === "upi" && styles.activeSwitch]}
          onPress={() => {
            setMethod("upi");
            setVerified(false);
          }}
        >
          <Ionicons name="business-outline" size={20} color={COLORS.primary} />
          <Text style={styles.switchText}>UPI ID</Text>
        </Pressable>
        <Pressable
          style={[styles.switchButton, method === "phone" && styles.activeSwitch]}
          onPress={() => {
            setMethod("phone");
            setVerified(false);
          }}
        >
          <Ionicons name="call-outline" size={20} color={COLORS.primary} />
          <Text style={styles.switchText}>Mobile Number</Text>
        </Pressable>
      </View>
      {method === "upi" ? (
        <TextInput
          style={styles.input}
          placeholder="Enter UPI ID"
          value={upiId}
          onChangeText={text => {
            setUpiId(text);
            setVerified(false);
          }}
          autoCapitalize="none"
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          value={phone}
          onChangeText={text => {
            setPhone(text);
            setVerified(false);
          }}
          keyboardType="phone-pad"
          maxLength={10}
        />
      )}
      <Pressable
        style={[styles.verifyButton, verified && styles.verifiedButton]}
        onPress={handleVerify}
        disabled={verifying}
      >
        <Text style={styles.verifyButtonText}>
          {verifying ? "Verifying..." : verified ? "Verified" : "Verify (optional)"}
        </Text>
        {verified && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginLeft: 6 }} />}
      </Pressable>
      <Pressable style={styles.payButton} onPress={handleProceed}>
        <Text style={styles.payButtonText}>Proceed to Pay</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  verifyButton: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  verifiedButton: {
    backgroundColor: COLORS.primary,
  },
  verifyButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  activeSwitch: {
    backgroundColor: COLORS.primary,
  },
  switchText: {
    marginLeft: 6,
    fontSize: 16,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: COLORS.text,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
