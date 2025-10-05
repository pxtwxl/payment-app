import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import api from '@/lib/axios'
import { COLORS } from "@/constants/colors";

export default function PayScreen() {
  const { upiId } = useLocalSearchParams()
  const router = useRouter()
  const { user } = useUser()

  const [amount, setAmount] = useState('')
  const [userPin, setUserPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentId, setPaymentId] = useState(null)

  const handleProceed = async () => {
    if (!upiId) {
      Alert.alert('Error', 'No UPI ID found.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount.')
      return
    }
    if (!userPin || userPin.length < 4) {
      Alert.alert('Error', 'Please enter your PIN.')
      return
    }
    try {
      const email = user?.primaryEmailAddress?.emailAddress

       const payPin = userPin
        const pinRes = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/user/validatePin/${encodeURIComponent(email)}/${encodeURIComponent(payPin)}`);
        const pinMatchResult = pinRes.data;
        if (!pinMatchResult) {
          Alert.alert("Error", "No PIN found for this user.");
          setLoading(false);
          return;
        }
      // if (userPin !== backendPin.toString()) {
      //   Alert.alert('Error', 'Incorrect PIN. Please try again.')
      //   return
      // }

      // PIN verified, proceed with payment
      const payerUpi = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/user/getUpiId/${encodeURIComponent(email)}`)
      setLoading(true)
        // console.log("[Anuj]upi Id:", upiId)
        if(upiId?.includes("bank") === false) {
          let phone = upiId;
          console.log("[Anuj]upi Id:", phone)
          let phoneRes = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/user/getUpiByPhone/${encodeURIComponent(phone)}`)
          if(phoneRes.data === "Invalid") {
            setLoading(false)
            Alert.alert('Error', 'No UPI ID found for this phone number.')
            return
          }

          const response = await api.post(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/payments/initiate`, {
            fromVpa: payerUpi.data,
            toVpa: phoneRes.data,
            amount: Number(amount),
          })

          // Save requestId for polling
          const payment = response.data
          setPaymentId(payment.requestId)
      } else {
        const response = await api.post(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/payments/initiate`, {
          fromVpa: payerUpi.data,
          toVpa: upiId,
          amount: Number(amount),
        })

        // Save requestId for polling
        const payment = response.data
        setPaymentId(payment.requestId)
      }


    } catch (err) {
      setLoading(false)
      Alert.alert('Error', 'Payment initiation failed.')
      console.error('Payment error:', err?.response?.data || err.message)
    }
  }

  // Poll payment status until not PENDING
  useEffect(() => {
    let interval
    if (paymentId) {
      const requestId = paymentId
      interval = setInterval(async () => {
        try {
          const res = await api.get(`${process.env.EXPO_PUBLIC_BASE_API_URL}/USER-SERVICE/payments/status/${requestId}`)
          const status = res.data
          if (status && status !== 'PENDING') {
            clearInterval(interval)
            setLoading(false)
            Alert.alert('Payment Result', `Status: ${status}`, [
              { text: "OK", onPress: () => router.replace("/") }
            ])
          }
        } catch (e) {
          console.log("Polling error", e)
        }
      }, 3000) // poll every 3 seconds
    }
    return () => clearInterval(interval)
  }, [paymentId])

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 12, color: COLORS.text }}>Processing payment...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Send Payment</Text>

          <Text style={styles.label}>To UPI ID</Text>
          <Text style={styles.upi}>{upiId}</Text>

          <Text style={styles.label}>Amount (INR)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Enter PIN</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="PIN"
            value={userPin}
            onChangeText={setUserPin}
            secureTextEntry
            maxLength={6}
          />

          <Pressable style={styles.button} onPress={handleProceed}>
            <Text style={styles.buttonText}>Proceed</Text>
          </Pressable>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  label: { color: COLORS.textLight, marginTop: 12, marginBottom: 6 },
  upi: { color: COLORS.text, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, backgroundColor: COLORS.card, color: COLORS.text },
  button: { backgroundColor: COLORS.primary, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: '600' },
})
