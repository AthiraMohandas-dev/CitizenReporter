import { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FeatureCard from "../components/FeatureCard";
import PrimaryButton from "../components/PrimaryButton";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Home() {
  // Measured height of the white "top" section (logo/title/tagline).
  // We use this instead of a guessed height * 0.24 so the hero image
  // is always placed just below the real text, never on top of it.
  const [topHeight, setTopHeight] = useState(null);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFFFFF", "#FFFFFF"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View
          style={styles.top}
          onLayout={(e) => setTopHeight(e.nativeEvent.layout.height)}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.title1}>CITIZEN</Text>
          <Text style={styles.title2}>REPORTER</Text>

          <Text style={styles.tagline}>
            See it.
            <Text style={styles.normal}> Report it.</Text>
            <Text style={styles.red}> Change it.</Text>
          </Text>
        </View>

        <View style={styles.bottom}>
          <View style={styles.featureRow}>
            <FeatureCard
              icon="shield-checkmark"
              title="Raise Your Voice"
              description="Report issues around you in seconds."
            />
            <View style={styles.divider} />
            <FeatureCard
              icon="location"
              title="Stronger Communities"
              description="Work together for safer places."
            />
            <View style={styles.divider} />
            <FeatureCard
              icon="heart"
              title="Real Impact"
              description="Every report can make a difference."
            />
          </View>

          <PrimaryButton
            title="GET STARTED"
            onPress={() => router.push("/report")}
          />

          <Text style={styles.footer}>
            Every Report Matters. Every Voice Counts.
          </Text>

          <View style={styles.dots}>
            <View style={styles.activeDot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Only render once we've measured `top`, so it never
            flashes in the wrong place on first paint. Position is
            now derived from real measured height, not a guess. */}
        {topHeight !== null && (
          <Image
            source={require("../../assets/images/hero.png")}
            style={[
              styles.heroImage,
              { top: topHeight + height * 0.055 }, // small overlap so the phone/hand bridges the seam, same as the design
            ]}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  top: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },

  title1: {
    fontSize: 36,
    fontWeight: "900",
    color: "#06214f",
    marginTop: -6,
  },

  title2: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2E86FF",
    marginTop: -10,
  },

  tagline: {
    marginTop: 6,
    fontSize: 18,
    color: "#06275F",
    fontWeight: "700",
  },

  normal: {
    color: "#06275F",
  },

  red: {
    color: "#FF4B55",
  },

  heroImage: {
    position: "absolute",
    width: width * 1.05,
    height: height * 0.34,
    resizeMode: "contain",
    alignSelf: "center",
    // `top` is now set dynamically via inline style above, not here
  },

  bottom: {
    flex: 0.6,
    backgroundColor: "#06214f",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingTop: height * 0.35,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },

  divider: {
    width: 1,
    height: 95,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 4,
    alignSelf: "center",
  },

  footer: {
    color: "#D8E5FF",
    textAlign: "center",
    fontSize: 11,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 15,
  },

  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
});
