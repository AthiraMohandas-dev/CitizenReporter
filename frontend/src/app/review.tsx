// app/ai-draft.jsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useReport } from "../context/ReportContext";
import { useState } from "react";

export default function ReviewAndSend() {
  const [sendError, setSendError] = useState(null);
  const { report } = useReport();
  const draft = report.draft;

  // Guard: if someone lands here without a draft (e.g. deep link, refresh),
  // send them back rather than rendering a broken screen with undefined fields.
  if (!draft) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.title}>No draft found</Text>
        <TouchableOpacity onPress={() => router.replace("/report")}>
          <Text style={{ color: "#1577ED", marginTop: 12 }}>
            Go back and create a report
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const officer = draft.officer ?? {};

  // No point drafting/showing an email if there's nowhere to send it —
  // route straight to a "can't email this, here's what to do instead" state
  if (!officer.email || !draft.mailto) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color="#06214f" />
          </TouchableOpacity>
          <Text style={styles.title}>Review & Send</Text>
        </View>

        <View style={styles.noEmailState}>
          <Ionicons name="mail-unread-outline" size={40} color="#8A93A6" />
          <Text style={styles.noEmailTitle}>No email contact available</Text>
          <Text style={styles.noEmailSubtitle}>
            {officer.department
              ? `${officer.department} does not have an email on record for ${draft.district ?? "this area"}.`
              : "We couldn't find a department to contact for this report."}{" "}
            Try calling instead.
          </Text>

          {officer.emergencyNumber && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL(`tel:${officer.emergencyNumber}`)}
            >
              <Ionicons name="call" size={16} color="#FFFFFF" />
              <Text style={styles.callButtonText}>
                Call {officer.emergencyNumber}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          >
            <Text style={{ color: "#1577ED", fontWeight: "600" }}>
              Edit report
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSendEmail = async () => {
    setSendError(null);
    if (!draft.mailto) {
      setSendError(
        "No email contact is available for this department yet. Try calling the emergency line instead.",
      );
      return;
    }
    try {
      const supported = await Linking.canOpenURL(draft.mailto);
      if (supported) {
        await Linking.openURL(draft.mailto);
        router.push("/confirmation");
      } else {
        setSendError("No email app is set up on this device.");
      }
    } catch (error) {
      setSendError("Something went wrong opening your email app.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color="#06214f" />
        </TouchableOpacity>
        <Text style={styles.title}>Review & Send</Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={12} color="#1577ED" />
              <Text style={styles.aiBadgeText}>AI DRAFTED</Text>
            </View>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="pencil" size={16} color="#8A93A6" />
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>To</Text>
            <Text style={styles.metaValue}>
              {draft.officer?.department ?? "Department not available"}
              {draft.district ? `, ${draft.district}` : ""}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Email</Text>
            <Text style={styles.metaValue}>
              {draft.officer?.email ?? "No email on record"}
            </Text>
          </View>

          <Text style={styles.subject}>{draft.subject}</Text>

          <Text style={styles.body}>{draft.body}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.back()}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
            <Text style={styles.sendButtonText}>Send via email</Text>
          </TouchableOpacity>
        </View>
        {sendError && (
          <TouchableOpacity
            style={styles.errorBanner}
            onPress={() =>
              draft.officer?.emergencyNumber &&
              Linking.openURL(`tel:${draft.officer.emergencyNumber}`)
            }
          >
            <Ionicons name="alert-circle-outline" size={16} color="#FD5650" />
            <Text style={styles.errorBannerText}>
              {sendError}
              {draft.officer?.emergencyNumber
                ? ` Tap to call ${draft.officer.emergencyNumber}.`
                : ""}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.footerNote}>
          Opens your own email app — sent from your address
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#06214f",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E4E9F2",
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },

  aiBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1577ED",
  },

  metaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },

  metaLabel: {
    fontSize: 12,
    color: "#8A93A6",
    width: 45,
  },

  metaValue: {
    fontSize: 12,
    color: "#06214f",
    fontWeight: "600",
    flex: 1,
  },

  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: "#06214f",
    marginTop: 10,
    marginBottom: 10,
  },

  body: {
    fontSize: 13,
    color: "#4A5568",
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  editButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#06214f",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },

  editButtonText: {
    color: "#06214f",
    fontWeight: "700",
    fontSize: 14,
  },

  sendButton: {
    flex: 1.4,
    backgroundColor: "#FD5650",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  footerNote: {
    textAlign: "center",
    fontSize: 11,
    color: "#8A93A6",
    marginBottom: 20,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF0EF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },

  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#B23A36", // darker coral for readability on the light coral background
    lineHeight: 17,
  },

  noEmailState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  noEmailTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#06214f",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },

  noEmailSubtitle: {
    fontSize: 13,
    color: "#8A93A6",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },

  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FD5650",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },

  callButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
