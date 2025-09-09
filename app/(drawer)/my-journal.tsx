import { Image, ScrollView, TouchableOpacity, View, Alert } from "react-native";
import React, { useState, useRef } from "react";
import Text from "../../components/UI/Text";
import DrawerHeader from "../../components/drawer/DrawerHeader";
import tw from "twrnc";
import { PlusIcon, ToolIcon } from "../../assets/icons/journalIcons";
import Modal from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import Form from "../../components/common/Form";
import AntDesign from "@expo/vector-icons/AntDesign";

const MyJournal = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [journals, setJournals] = useState([
    {
      id: 1,
      title: "Glow Up Journey",
      time: "Last updated: July 20",
      entries: "8 entries",
      url: require("../../assets/images/glowup.jpg"),
    },
    {
      id: 2,
      title: "Hydration Goals",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/hydrationgoals.jpg"),
    },
    {
      id: 3,
      title: "Before & After Archive",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    },
    {
      id: 4,
      title: "Travel Skin Changes",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    },
    {
      id: 5,
      title: "Wellness Challenges",
      time: "Last updated: July 20",
      entries: "2 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    },
  ]);

  const [editJournalName, setEditJournalName] = useState("");
  const [editJournalDescription, setEditJournalDescription] = useState("");
  const toolIconRefs = useRef([]);

  const handleToolIconPress = (item: any, index: any) => {
    toolIconRefs.current[index].measure((x, y, width, height, pageX, pageY) => {
      setTooltipPosition({
        x: pageX - 100, // Adjust based on tooltip width
        y: pageY + height,
      });
      setSelectedJournal(item);
    });
  };

  const handleEdit = () => {
    // Set the current values for editing
    setEditJournalName(selectedJournal.title);
    setEditJournalDescription(selectedJournal.description || "");
    setShowEditModal(true);
    setSelectedJournal(null); // Close tooltip
  };

  const handleSaveEdit = () => {
    // Update the journal with new values
    setJournals((prevJournals) =>
      prevJournals.map((journal) =>
        journal.id === selectedJournal.id
          ? {
              ...journal,
              title: editJournalName,
              description: editJournalDescription,
              time: `Last updated: ${new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}`,
            }
          : journal
      )
    );
    setShowEditModal(false);
    setSelectedJournal(null);
  };

  const handleDelete = () => {
    // Show confirmation alert before deleting
    Alert.alert(
      "Delete Journal",
      `Are you sure you want to delete "${selectedJournal.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            setJournals((prevJournals) =>
              prevJournals.filter(
                (journal) => journal.id !== selectedJournal.id
              )
            );
            setSelectedJournal(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleCreateNewJournal = () => {
    // Add a new journal
    const newJournal = {
      id: Date.now(), // Simple ID generation
      title: "New Journal",
      time: `Last updated: ${new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`,
      entries: "0 entries",
      url: require("../../assets/images/beforeafter.jpg"),
    };

    setJournals((prevJournals) => [newJournal, ...prevJournals]);
    setShowCreateModal(false);
  };

  return (
    <View style={tw`pt-12 relative flex-1`}>
      <Image
        style={tw`absolute left-[-2rem]`}
        source={require("../../assets/images/drawerRectangle2.png")}
      />

      <Image
        style={tw`absolute bottom-[-1rem] right-[-2rem]`}
        source={require("../../assets/images/draweRectangle.png")}
      />
      <DrawerHeader
        title="My Daily Reflection"
        button={
          <View
            style={tw`h-[56.02px] shadow-md w-[56.02px] rounded-full items-center justify-center bg-white`}
          >
            <PlusIcon />
          </View>
        }
        action={() => setShowCreateModal(true)}
      />

      <ScrollView
        contentContainerStyle={tw`px-4 mt-[1.3rem]`}
        showsVerticalScrollIndicator={false}
      >
        {journals.map((item, index) => (
          <View
            key={item.id}
            style={tw`bg-white mb-4 rounded-[11px] h-[99px] p-2 flex-row items-center justify-between`}
          >
            <View style={tw`flex-row items-center gap-2`}>
              <Image
                source={item?.url}
                style={tw`h-[83px] w-[83px] object-cover rounded-[7px]`}
              />

              <View>
                <Text classN="" type="title" fontSize={18} fontWeight="medium">
                  {item?.title}
                </Text>

                <Text type="body" fontSize={14} classN="text-[#585858] my-1">
                  {item?.time}
                </Text>
                <Text type="body" fontSize={14} classN="text-[#585858]">
                  {item?.entries}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              ref={(el) => (toolIconRefs.current[index] = el)}
              style={tw`bg-[#F5F5F5F5] h-[35px] w-[35px] items-center justify-center rounded-full`}
              onPress={() => handleToolIconPress(item, index)}
            >
              <ToolIcon />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Tooltip Modal */}
      {selectedJournal && (
        <View
          style={[
            tw`absolute bg-white rounded-lg p-3 shadow-lg z-10`,
            {
              top: tooltipPosition.y,
              left: tooltipPosition.x,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
          ]}
        >
          <TouchableOpacity
            style={tw`flex-row items-center py-2 px-3`}
            onPress={handleEdit}
          >
            <AntDesign name="edit" size={16} color="#4B5563" />
            <Text classN={`ml-2 text-gray-700`}>Edit</Text>
          </TouchableOpacity>

          <View style={tw`h-px bg-gray-200 my-1`} />

          <TouchableOpacity
            style={tw`flex-row items-center py-2 px-3`}
            onPress={handleDelete}
          >
            <AntDesign name="delete" size={16} color="#EF4444" />
            <Text classN={`ml-2 text-red-500`}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Backdrop to close tooltip when tapping outside - Fixed to not capture tooltip clicks */}
      {selectedJournal && (
        <TouchableOpacity
          style={tw`absolute inset-0 z-0`}
          activeOpacity={1}
          onPress={() => setSelectedJournal(null)}
        />
      )}

      {/* Create Journal Modal */}
      <Modal
        isVisible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        backdropOpacity={0.7}
        animationType="fade"
        style="bg-white p-6 rounded-[34px] shadow-lg w-11/12 max-w-md"
      >
        <Text type="title" classN="text-center" fontSize={22}>
          Create New Journal
        </Text>

        <Text
          type="body"
          classN="text-[#585858] mb-5 mt-1 mb-5 text-center"
          fontSize={14}
        >
          Track your beauty, wellness, or recovery journey
        </Text>

        <View
          style={tw`w-[84px] bg-gray-100 items-center justify-center mx-auto rounded-full h-[84px]`}
        >
          <AntDesign name="user" size={28} color="black" />
        </View>

        <TouchableOpacity
          style={tw`h-[29.5px] items-center justify-center relative top-[-2rem] border-solid border-white border-[2px] left-[11.5rem] rounded-full w-[29.5px] bg-[#F5F5F5]`}
        >
          <AntDesign name="edit" size={12} color="black" />
        </TouchableOpacity>

        <View>
          <Form
            type=""
            containerStyle="mb-6"
            label="Journal Name"
            placeholder="Enter your journal name"
          />

          <Form
            type=""
            containerStyle="mb-6"
            label="Description (optional)"
            placeholder="Enter description"
          />
        </View>

        <Button
          onPress={handleCreateNewJournal}
          text={true}
          title="Create Journal"
        />

        <TouchableOpacity
          style={tw`items-center justify-center mt-4`}
          onPress={() => setShowCreateModal(false)}
        >
          <Text classN="text-gray-500">Cancel</Text>
        </TouchableOpacity>
      </Modal>

      {/* Edit Journal Modal */}
      <Modal
        isVisible={showEditModal}
        onClose={() => setShowEditModal(false)}
        backdropOpacity={0.7}
        animationType="fade"
        style="bg-white p-6 rounded-[34px] shadow-lg w-11/12 max-w-md"
      >
        <Text type="title" classN="text-center" fontSize={22}>
          Edit Journal
        </Text>

        <Text
          type="body"
          classN="text-[#585858] mb-5 mt-1 mb-5 text-center"
          fontSize={14}
        >
          Update your journal details
        </Text>

        <View
          style={tw`w-[84px] bg-gray-100 items-center justify-center mx-auto rounded-full h-[84px]`}
        >
          <AntDesign name="user" size={28} color="black" />
        </View>

        <TouchableOpacity
          style={tw`h-[29.5px] items-center justify-center relative top-[-2rem] border-solid border-white border-[2px] left-[11.5rem] rounded-full w-[29.5px] bg-[#F5F5F5]`}
        >
          <AntDesign name="edit" size={12} color="black" />
        </TouchableOpacity>

        <View>
          <Form
            type=""
            containerStyle="mb-6"
            label="Journal Name"
            placeholder="Enter your journal name"
            value={editJournalName}
            onChangeText={setEditJournalName}
          />

          <Form
            type=""
            containerStyle="mb-6"
            label="Description (optional)"
            placeholder="Enter description"
            value={editJournalDescription}
            onChangeText={setEditJournalDescription}
          />
        </View>

        <Button onPress={handleSaveEdit} text={true} title="Save Changes" />

        <TouchableOpacity
          style={tw`items-center justify-center mt-4`}
          onPress={() => setShowEditModal(false)}
        >
          <Text classN="text-gray-500">Cancel</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MyJournal;
