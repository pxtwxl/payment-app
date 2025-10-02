import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { COLORS } from '@/constants/colors'

export default function PayScreen() {
  const { upiId } = useLocalSearchParams()
  const router = useRouter()
  const [amount, setAmount] = useState('')

  const handleProceed = () => {
    if (!upiId) {
      Alert.alert('Error', 'No UPI ID found.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Error', 'Enter a valid amount.')
      return
    }
    Alert.alert('Proceed', `Paying ₹${amount} to ${upiId}`)
    router.back()
  }

  return (
    <View style={styles.container}>
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
      <Pressable style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Proceed</Text>
      </Pressable>
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


