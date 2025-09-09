import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Modal from "../../components/UI/Modal";
import Text from "../../components/UI/Text";
import Button from "../../components/UI/Button";
import tw from "twrnc";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

interface EditJournalModalProps {
  isVisible: boolean;
  onClose: () => void;
  journal: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
  };
  onSave: (journalData: {
    title: string;
    description?: string;
    image?: string;
  }) => void;
  userAvatar?: string;
}

const EditJournalModal: React.FC<EditJournalModalProps> = ({
  isVisible,
  onClose,
  journal,
  onSave,
  userAvatar,
}) => {
  const [title, setTitle] = useState(journal.title);
  const [description, setDescription] = useState(journal.description || "");
  const [image, setImage] = useState(journal.imageUrl || userAvatar);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photos to change the journal image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Journal name is required");
      return;
    }

    setIsLoading(true);

    const journalData = {
      title: title.trim(),
      description: description.trim() || undefined,
      image: image !== journal.imageUrl ? image : undefined,
    };

    onSave(journalData);
    setIsLoading(false);
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle(journal.title);
    setDescription(journal.description || "");
    setImage(journal.imageUrl || userAvatar);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      animationType="slide"
      backdropOpacity={0.7}
      style="bg-white p-6 rounded-xl w-11/12 max-w-md max-h-80vh"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={tw`items-center mb-6`}>
          <Text type="title" fontSize={22} classN="text-center mb-2">
            Edit Journal
          </Text>
          <Text type="body" classN="text-[#585858] text-center" fontSize={14}>
            Refresh your journal's details to reflect your evolving journey
          </Text>
        </View>

        {/* Avatar with Edit Button */}
        <View style={tw`items-center mb-6`}>
          <View style={tw`relative`}>
            <Image
              source={{
                uri: image || require("../../assets/images/default-avatar.png"),
              }}
              style={tw`w-20 h-20 rounded-full bg-gray-200`}
              onError={() =>
                setImage(require("../../assets/images/default-avatar.png"))
              }
            />
            <TouchableOpacity
              onPress={handleImagePick}
              style={tw`absolute bottom-0 right-0 bg-[#4ADE80] rounded-full p-2 border-2 border-white`}
            >
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Journal Name Input */}
        <View style={tw`mb-4`}>
          <Text type="body" fontSize={14} classN="text-[#374151] mb-2">
            Journal Name *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter journal name"
            style={tw`border border-[#D1D5DB] rounded-lg px-4 py-3 text-[16px] bg-white`}
            placeholderTextColor="#9CA3AF"
            maxLength={50}
          />
          <Text
            type="body"
            fontSize={12}
            classN="text-[#6B7280] mt-1 text-right"
          >
            {title.length}/50
          </Text>
        </View>

        {/* Journal Description Input */}
        <View style={tw`mb-6`}>
          <Text type="body" fontSize={14} classN="text-[#374151] mb-2">
            Journal Description (Optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your journal (what you'll track, goals, etc.)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={tw`border border-[#D1D5DB] rounded-lg px-4 py-3 text-[16px] min-h-[120px] bg-white`}
            placeholderTextColor="#9CA3AF"
            maxLength={200}
          />
          <Text
            type="body"
            fontSize={12}
            classN="text-[#6B7280] mt-1 text-right"
          >
            {description.length}/200
          </Text>
        </View>

        {/* Buttons */}
        <View style={tw`flex-row gap-3`}>
          <Button
            onPress={handleClose}
            text={true}
            title="Cancel"
            btnStyle="flex-1 bg-gray-100 border border-gray-300"
            textStyle="text-gray-700"
            disabled={isLoading}
          />
          <Button
            onPress={handleSave}
            text={true}
            title="Save Changes"
            btnStyle="flex-1 bg-[#4ADE80]"
            isLoading={isLoading}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditJournalModal;
