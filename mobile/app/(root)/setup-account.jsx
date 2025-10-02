
import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import api from '@/lib/axios'
import { useUser } from '@clerk/clerk-expo'

export default function SetupAccount() {
  const router = useRouter()
  const { user } = useUser()

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [bankName, setBankName] = useState('Bank A')
  const [bankAccount, setBankAccount] = useState('')
  const [bankIfsc, setBankIfsc] = useState('')
  const [upiId, setUpiId] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const primaryEmail = user?.primaryEmailAddress?.emailAddress || ''
    setEmail(primaryEmail)
  }, [user])

  const handleSubmit = async () => {
    const formData = {
      email,
      name: fullName,
      phone,
      address,
      bankName,
      bankAccount,
      bankIfsc,
      upiId,
    };
    try {
      const response = await api.post('http://192.168.0.24:8091/user/create', formData);
      // You can handle response here, e.g. show success or save token
      alert('Payment account setup successful!');
      router.replace('/');
    } catch (err) {
      alert('Failed to setup account. Please try again.');
      console.error('Setup account error:', err?.response?.data || err.message);
    }
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Setup Payment Account
      </Text>

      <Text>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter full name"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 }}
      />

      <Text>Phone Number</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 }}
      />

      <Text>Email</Text>
      <TextInputx
        value={email}
        editable={false}
        selectTextOnFocus={false}
        placeholder="Email"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5, backgroundColor: '#F2F2F2', color: '#777' }}
      />

      <Text>Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        multiline
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 10,
          borderRadius: 5,
          minHeight: 60,
          textAlignVertical: 'top',
        }}
      />

      <Text>Bank Name</Text>
      <Picker
        selectedValue={bankName}
        onValueChange={(value) => setBankName(value)}
        style={{ borderWidth: 1, marginBottom: 10 }}
      >
        <Picker.Item label="Bank A" value="Bank A" />
        <Picker.Item label="Bank B" value="Bank B" />
      </Picker>

      <Text>Bank Account Number</Text>
      <TextInput
        value={bankAccount}
        onChangeText={setBankAccount}
        placeholder="Enter account number"
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 }}
      />

      <Text>IFSC Code</Text>
      <TextInput
        value={bankIfsc}
        onChangeText={setBankIfsc}
        placeholder="Enter IFSC code"
        autoCapitalize="characters"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 }}
      />

      <Text>UPI ID</Text>
      <TextInput
        value={upiId}
        onChangeText={setUpiId}
        placeholder="Enter UPI ID"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 8, marginBottom: 20, borderRadius: 5 }}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{ backgroundColor: 'green', padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
