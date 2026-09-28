/**
 * SCREEN 3 — Phone Auth / OTP
 * Optional — only shown when user action requires an account.
 * Two sub-states: phone entry → OTP verification.
 * No real auth logic yet.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../src/theme";

type AuthStep = "phone" | "otp";

export default function AuthScreen() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    // TODO: call Supabase auth.signInWithOtp({ phone })
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    // TODO: call Supabase auth.verifyOtp({ phone, token: otp, type: 'sms' })
    router.back(); // return to whichever screen triggered auth
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === "phone" ? (
          <>
            <Text style={styles.heading}>Enter your phone number</Text>
            <Text style={styles.sub}>
              We'll send a one-time code to verify your number. No password
              needed.
            </Text>

            {/* Phone input */}
            <View style={styles.inputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryText}>🇷🇼 +250</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="7XX XXX XXX"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={9}
                accessibilityLabel="Phone number"
              />
            </View>

            <Text style={styles.legal}>
              By continuing you agree to our Terms of Service and Privacy
              Policy.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.heading}>Enter verification code</Text>
            <Text style={styles.sub}>
              Sent to +250 {phone}
            </Text>

            <TextInput
              style={[styles.input, styles.otpInput]}
              placeholder="• • • • • •"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              textAlign="center"
              accessibilityLabel="OTP code"
            />

            <TouchableOpacity onPress={() => setStep("phone")}>
              <Text style={styles.resend}>Resend code · Change number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.actions}>
        {step === "phone" ? (
          <Button
            label="Send code"
            onPress={handleSendOtp}
            disabled={phone.length < 9}
          />
        ) : (
          <Button
            label="Verify"
            onPress={handleVerifyOtp}
            disabled={otp.length < 6}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    height: 52,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  closeBtn: {
    padding: Spacing.sm,
  },
  closeText: {
    fontSize: FontSize.md,
    color: Colors.mid,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.base,
  },
  heading: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  sub: {
    fontSize: FontSize.base,
    color: Colors.darkMid,
    lineHeight: FontSize.base * 1.6,
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  countryCode: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
  },
  countryText: {
    fontSize: FontSize.base,
    color: Colors.dark,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.dark,
    height: 52,
    backgroundColor: Colors.white,
  },
  otpInput: {
    fontSize: FontSize.xxl,
    letterSpacing: 8,
    textAlign: "center",
  },
  legal: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    lineHeight: FontSize.xs * 1.6,
  },
  resend: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  actions: {
    gap: Spacing.sm,
  },
});
