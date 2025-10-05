import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { COLORS } from "@/constants/colors";
import api from "@/lib/axios";
import { useUser } from "@clerk/clerk-expo";

export default function TransactionHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const fetchPayments = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const res = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/payments/history/${encodeURIComponent(email)}`);
        setPayments(res.data || []);
      } catch (err) {
        Alert.alert("Error", err?.response?.data?.message || "Failed to fetch payments.");
      }
      setLoading(false);
    };
    fetchPayments();
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : payments.length === 0 ? (
        <Text style={styles.emptyText}>No payments found.</Text>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.paymentItem}>
              <Text style={styles.paymentText}>
                {item.type === "credit" ? "Received" : "Sent"} ₹{item.amount}
              </Text>
              <Text style={styles.paymentDetails}>
                {item.type === "credit" ? `From: ${item.fromVpa}` : `To: ${item.toVpa}`}
              </Text>
              <Text style={styles.paymentDate}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</Text>
              <Text
                style={[
                  styles.paymentStatus,
                  item.status === "SUCCESS"
                    ? { color: "green" }
                    : item.status === "FAILED"
                    ? { color: "red" }
                    : { color: COLORS.textLight }
                ]}
              >
                {item.status ? item.status : "Unknown"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paymentStatus: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "left",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 18,
    textAlign: "center",
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  paymentItem: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  paymentDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
    textAlign: "right",
  },
});
