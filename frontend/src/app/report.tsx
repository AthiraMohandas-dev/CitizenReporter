// app/report.jsx
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { generateEmail } from "../api/reportApi";
import { useReport } from "../context/ReportContext";
import { Dropdown } from "react-native-element-dropdown";
import { districts } from "../constants/districts";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";

const CATEGORIES = [
  "Environmental Pollution",
  "Public Safety",
  "Roads & Infrastructure",
  "Animal Welfare",
  "Water Supply",
  "Law & Order",
  "Forest & Nature",
  "Food Safety",
  "other",
];

export default function NewReport() {
  const { report, updateReport } = useReport();

  const [selectedCategory, setSelectedCategory] = useState(report.category);
  const [district, setDistrict] = useState(report.district);
  const [location, setLocation] = useState(report.location);
  const [issue, setIssue] = useState(report.description);
  const [photo, setPhoto] = useState(report.photo);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      // later: could show a friendly alert explaining why permission is needed
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleGenerateEmail = async () => {
    setIsGenerating(true);
    try {
      const emailContent = await generateEmail(issue, report.category);
      updateReport({ draft: emailContent.data });
      router.push({
        pathname: "/review",
      });
    } finally {
      setIsGenerating(false);
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
        <Text style={styles.title}>New Report</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1, // lets content container grow to fill available space when content is short
          justifyContent: "space-between", // pushes generate button + footer toward bottom, form fields toward top
          paddingBottom: 20,
        }}
      >
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((category) => {
            const isSelected = category === report.category;
            return (
              <TouchableOpacity
                key={category}
                onPress={() => updateReport({ category })}
                style={[styles.chip, isSelected && styles.chipSelected]}
              >
                <View style={[styles.dot, isSelected && styles.dotSelected]} />
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.sectionLabel}>DISTRICT</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.locationInput}
          selectedTextStyle={styles.locationInput}
          inputSearchStyle={styles.searchInput}
          iconStyle={styles.iconStyle}
          data={districts}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select District"
          searchPlaceholder="Search district..."
          value={district}
          onChange={(item) => {
            setDistrict(item.value);
          }}
        />
        {/* <View style={styles.locationRow}>
          <TextInput
            style={styles.locationInput}
            value={district}
            onChangeText={setDistrict}
            placeholder="Enter district"
            placeholderTextColor="#8A93A6"
          />
          <TouchableOpacity
            style={styles.editButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              // later: could trigger GPS re-fetch or focus the input
            }}
          >
            <Ionicons name="pencil" size={16} color="#1577ED" />
          </TouchableOpacity>
        </View> */}
        <Text style={styles.sectionLabel}>LOCATION</Text>
        <View style={styles.locationRow}>
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
            placeholderTextColor="#8A93A6"
          />
          <TouchableOpacity
            style={styles.editButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              // later: could trigger GPS re-fetch or focus the input
            }}
          >
            <Ionicons name="pencil" size={16} color="#1577ED" />
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionLabel}>WHAT DID YOU SEE?</Text>
        <TextInput
          style={styles.descriptionInput}
          value={issue}
          onChangeText={setIssue}
          placeholder="Describe what you want to report..."
          placeholderTextColor="#8A93A6"
          multiline
          textAlignVertical="top" // Android: without this, text starts vertically centered instead of top-aligned
          scrollEnabled={true}
        />
        <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={18} color="#1577ED" />
              <Text style={styles.photoButtonText}>Add a photo (optional)</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.generateButton,
            isGenerating && styles.generateButtonDisabled,
          ]}
          onPress={handleGenerateEmail}
          disabled={isGenerating}
        >
          <Text style={styles.generateButtonText}>
            {isGenerating ? "Generating..." : "Generate email with AI"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.poweredBy}>Powered by Gemini</Text>

        {/* location, description, photo, button go here in later steps */}
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
    marginBottom: 24,
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

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8A93A6",
    letterSpacing: 0.5,
    marginBottom: 10,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
    width: "100%",
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#06214f",
    backgroundColor: "#FFFFFF",
    minHeight: 40, // ensures consistent tap-target height regardless of platform font metrics
  },

  chipSelected: {
    backgroundColor: "#FD5650", // coral
    borderColor: "#FD5650",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#06214f",
    marginRight: 6,
  },

  dotSelected: {
    backgroundColor: "#FFFFFF",
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#06214f",
  },

  chipTextSelected: {
    color: "#FFFFFF",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E9F2",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },

  locationInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#06214f",
    padding: 0, // removes default RN TextInput padding so it aligns with the design
  },

  editButton: {
    marginLeft: 10,
  },

  descriptionInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E9F2",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: "500",
    color: "#06214f",
    minHeight: 150,
    maxHeight: 160, // caps growth — box stops expanding and scrolls internally instead
    marginBottom: 16,
    lineHeight: 20,
  },

  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#1577ED",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    backgroundColor: "#EAF2FF", // faint blue tint matching the design
    overflow: "hidden",
  },

  photoButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1577ED",
    marginLeft: 8,
  },

  photoPreview: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },

  generateButton: {
    backgroundColor: "#FD5650", // coral
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  generateButtonDisabled: {
    opacity: 0.6,
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  poweredBy: {
    textAlign: "center",
    fontSize: 11,
    color: "#8A93A6",
    marginTop: 10,
    marginBottom: 20,
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#5A6787",
    textTransform: "uppercase",
  },

  dropdown: {
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DCE4F2",
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  placeholderStyle: {
    color: "#A0A7B8",
    fontSize: 15,
  },

  selectedTextStyle: {
    fontSize: 15,
    color: "#06214F",
  },

  searchInput: {
    height: 45,
    borderRadius: 10,
  },

  iconStyle: {
    width: 22,
    height: 22,
  },
});
