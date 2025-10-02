import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRouter } from 'expo-router'
import { COLORS } from '@/constants/colors'

export default function ScanQR() {
  const router = useRouter()
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    if (!permission) requestPermission()
  }, [permission])

  const onBarcodeScanned = ({ data }) => {
    if (scanned) return
    setScanned(true)
    try {
      // Expect UPI QR like: upi://pay?pa=upiid@bank&pn=Name&...
      const url = new URL(data)
      if (url.protocol !== 'upi:' || url.hostname !== 'pay') {
        throw new Error('Not a UPI code')
      }
      const upiId = url.searchParams.get('pa')
      if (!upiId) throw new Error('UPI ID missing')
      router.replace({ pathname: '/pay', params: { upiId } })
    } catch (e) {
      Alert.alert('Invalid QR', 'Could not parse a valid UPI code.')
      setScanned(false)
    }
  }

  if (!permission) return null
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>We need camera permission to scan QR codes.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} onBarcodeScanned={onBarcodeScanned} barcodeScannerSettings={{ barcodeTypes: ['qr'] }}>
        <View style={styles.overlay} />
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  camera: { flex: 1 },
  overlay: { flex: 1, borderColor: COLORS.primary, borderWidth: 2, margin: 40, borderRadius: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { color: COLORS.text, textAlign: 'center' },
})


