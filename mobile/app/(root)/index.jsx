import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { COLORS } from "@/constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import Swiper from "react-native-swiper";
import { styles as istyles } from "@/assets/styles/auth.styles.js";
import { SignOutButton } from "@/components/SignOutButton";
import { useRouter } from "expo-router";


const { width } = Dimensions.get("window");

function ProfileMenu({ router }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: "relative" }}>
      <Pressable
        style={styles.profileButton}
        onPress={() => setOpen((v) => !v)}
        accessibilityLabel="Open profile menu"
      >
        <Ionicons
          name="person-circle-outline"
          size={36}
          color={COLORS.primary}
        />
      </Pressable>
      {open && (
        <View style={styles.menuContainer}>
          <MenuItem
            label="Account"
            onPress={() => {
              setOpen(false);
              router.push("/setup-account");
            }}
          />
          <MenuItem
            label="Create PIN"
            onPress={() => {
              setOpen(false);
              router.push("/create-pin");
            }}
          />
          <MenuItem
            label="Generate QR"
            onPress={() => {
              setOpen(false);
              router.push("/generate-qr");
            }}
          />
          <MenuItem
            label="History"
            onPress={() => {
              setOpen(false);
              router.push("/transaction-history");
            }}
          />

          <View style={styles.menuItem}>
            <SignOutButton />
          </View>
        </View>
      )}
    </View>
  );
}

function MenuItem({ label, onPress }) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{label}</Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Top bar with profile icon */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <ProfileMenu router={router} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Banner Section */}
        <View style={istyles.container}>
          <Image
            source={require("../../assets/images/revenue-i2.png")}
            style={[istyles.illustration, { alignSelf: "center" }]}
          />
        </View>

        {/* Money Transfers Section */}
        <Text style={styles.sectionTitle}>Money Transfers</Text>
        <View style={styles.row}>
          <ActionButton icon="call-outline" label="To Mobile Number" onPress={() => router.push('/pay-to-user')} />
          <ActionButton icon="business-outline" label="To Bank UPI ID" onPress={() => router.push('/pay-to-user')} />
          <ActionButton icon="qr-code-outline" label="Scan QR & Pay" onPress={() => router.push('/scan-qr')} />
          <ActionButton icon="wallet-outline" label="Check Balance" onPress={() => router.push('/check-balance')} />
        </View>

        {/* 🔥 Slideshow Banner Section */}
        <View style={styles.sliderContainer}>
          <Swiper
            autoplay
            height={160}
            autoplayTimeout={5}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
          >
            <Image
              source={require("../../assets/images/banner1.png")}
              style={styles.slideImage}
            />
            <Image
              source={require("../../assets/images/banner2.jpg")}
              style={styles.slideImage}
            />
            <Image
              source={require("../../assets/images/banner3.jpg")}
              style={styles.slideImage}
            />
          </Swiper>
        </View>

        {/* Recharge & Bills Section */}
        <Text style={styles.sectionTitle}>Recharge & Bills</Text>
        <View style={styles.row}>
          <ActionButton icon="phone-portrait-outline" label="Mobile Recharge" />
          <ActionButton icon="car-outline" label="FASTag Recharge" />
          <ActionButton icon="flash-outline" label="Electricity Bill" />
          <ActionButton icon="card-outline" label="Loan Repayment" />
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({ icon, label, onPress }) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={32} color={COLORS.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    top: 44,
    right: 0,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    minWidth: 170,
    zIndex: 100,
    paddingVertical: 4,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    minHeight: 56,
    zIndex: 1000,
    elevation: 10,
  },
  profileButton: {
    padding: 2,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  actionLabel: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
    marginTop: 6,
  },
  bannerContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  sliderContainer: {
    marginVertical: 20,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
  },
  slideImage: {
    width: width - 40,
    height: 160,
    borderRadius: 16,
    alignSelf: "center",
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});
