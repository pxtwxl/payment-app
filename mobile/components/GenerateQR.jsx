import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { COLORS } from "@/constants/colors";
import { useUser } from "@clerk/clerk-expo";
import { api } from "@/lib/axios";

export default function GenerateQR() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName || user?.firstName || "";
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUpi = async () => {
      try {
        if (!email) return;
        const res = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/user/getUpiId/${encodeURIComponent(email)}`);
        setUpiId(res?.data || "");
      } catch (e) {
        Alert.alert("Error", "Unable to fetch UPI ID");
      } finally {
        setLoading(false);
      }
    };
    loadUpi();
  }, [email]);

  const amount = ""; // optional
  const upiUrl = upiId ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(displayName)}&am=${amount}&cu=INR` : "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan to Pay</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : upiId ? (
        <>
          <QRCode
            value={upiUrl}
            size={220}
            color={COLORS.primary}
            backgroundColor={COLORS.background}
          />
          <Text style={styles.upiText}>{upiId}</Text>
        </>
      ) : (
        <Text style={styles.upiText}>No UPI ID</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
  },
  upiText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
});
