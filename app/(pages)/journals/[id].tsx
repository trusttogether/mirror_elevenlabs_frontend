import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useRef } from "react";
import Text from "../../../components/UI/Text";
import tw from "twrnc";
import { router } from "expo-router";
import {
  ArrowLeft,
  Plus,
  Trash2,
  BarChart3,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react-native";

const JournalDetails = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const calendarHeight = useRef(new Animated.Value(0)).current;

  // Sample saved scans data
  const savedScans = [
    {
      id: 1,
      date: new Date(2025, 8, 5), // September 5, 2025
      title: "Morning Skin Analysis",
      description: "Post-cleansing skin assessment",
      score: 85,
      image: require("../../../assets/images/glowup.jpg"),
      metrics: {
        hydration: 88,
        redness: 72,
        inflammation: 65,
      },
    },
    {
      id: 2,
      date: new Date(2025, 8, 5), // September 5, 2025
      title: "Evening Checkup",
      description: "After daily skincare routine",
      score: 78,
      image: require("../../../assets/images/hydrationgoals.jpg"),
      metrics: {
        hydration: 82,
        redness: 68,
        inflammation: 72,
      },
    },
    {
      id: 3,
      date: new Date(2025, 8, 5), // September 5, 2025
      title: "Weekly Progress",
      description: "7-day skin transformation",
      score: 92,
      image: require("../../../assets/images/beforeafter.jpg"),
      metrics: {
        hydration: 95,
        redness: 45,
        inflammation: 38,
      },
    },
    {
      id: 4,
      date: new Date(2025, 8, 10), // September 10, 2025
      title: "Post-Treatment",
      description: "After new serum application",
      score: 67,
      image: require("../../../assets/images/glowup.jpg"),
      metrics: {
        hydration: 72,
        redness: 85,
        inflammation: 78,
      },
    },
    {
      id: 5,
      date: new Date(2025, 8, 15), // September 15, 2025
      title: "Mid-Month Check",
      description: "Routine effectiveness evaluation",
      score: 91,
      image: require("../../../assets/images/hydrationgoals.jpg"),
      metrics: {
        hydration: 94,
        redness: 42,
        inflammation: 35,
      },
    },
  ];

  // Toggle calendar with smooth animation
  const toggleCalendar = () => {
    if (showCalendar) {
      Animated.timing(calendarHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => setShowCalendar(false));
    } else {
      setShowCalendar(true);
      Animated.timing(calendarHeight, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };

  // Generate dates for the horizontal scrollable pills
  const generateDatePills = () => {
    const pills = [];
    const today = new Date();

    // Generate 30 days (current date + 29 previous days)
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const scans = savedScans.filter(
        (scan) =>
          scan.date.getDate() === date.getDate() &&
          scan.date.getMonth() === date.getMonth() &&
          scan.date.getFullYear() === date.getFullYear()
      );

      pills.push({
        date,
        hasScan: scans.length > 0,
        scanImage: scans.length > 0 ? scans[0].image : null,
      });
    }

    return pills;
  };

  const datePills = generateDatePills();

  // Generate calendar dates for the current month with proper structure
  const generateCalendarDates = () => {
    const dates = [];
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      dates.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i),
        isCurrentMonth: false,
        hasScan: false,
      });
    }

    // Add current month's dates
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      dates.push({
        date,
        isCurrentMonth: true,
        hasScan: savedScans.some(
          (scan) =>
            scan.date.getDate() === i &&
            scan.date.getMonth() === currentMonth.getMonth() &&
            scan.date.getFullYear() === currentMonth.getFullYear()
        ),
      });
    }

    // Fill remaining cells to complete the calendar grid (6 rows × 7 columns)
    const remainingCells = 42 - dates.length;
    for (let i = 1; i <= remainingCells; i++) {
      dates.push({
        date: new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          i
        ),
        isCurrentMonth: false,
        hasScan: false,
      });
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleDeleteScan = (scanId: number) => {
    Alert.alert("Delete Scan", "Are you sure you want to delete this scan?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Scan deleted successfully");
          setShowTooltip(false);
        },
      },
    ]);
  };

  const handleCompare = () => {
    Alert.alert("Compare", "Compare feature would open here");
    setShowHeaderTooltip(false);
  };

  const handleAddNew = () => {
    Alert.alert("Add New", "Add new scan feature would open here");
    setShowHeaderTooltip(false);
  };

  const handleHeaderDelete = () => {
    Alert.alert("Delete", "Delete feature would open here");
    setShowHeaderTooltip(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getScansForDate = (date: Date) => {
    return savedScans.filter(
      (scan) =>
        scan.date.getDate() === date.getDate() &&
        scan.date.getMonth() === date.getMonth() &&
        scan.date.getFullYear() === date.getFullYear()
    );
  };

  const handleToolIconPress = (scanId: number) => {
    setSelectedScanId(scanId);
    setShowTooltip(!showTooltip);
  };

  // Weekday headers
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row justify-between items-center px-4 py-4 border-b border-gray-200`}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text fontWeight="bold" fontSize={20} type="title">
          Skin Journal
        </Text>

        {/* Single Tool Icon instead of 3 separate ones */}
        <TouchableOpacity
          onPress={() => setShowHeaderTooltip(!showHeaderTooltip)}
          style={tw`bg-gray-100 rounded-full w-10 h-10 items-center justify-center`}
        >
          <MoreVertical size={20} color="#000" />
        </TouchableOpacity>

        {/* Header Tooltip */}
        {showHeaderTooltip && (
          <View
            style={tw`absolute top-16 right-4 bg-white rounded-lg p-2 shadow-lg z-20 border border-gray-200`}
          >
            <TouchableOpacity
              style={tw`flex-row items-center py-2 px-3`}
              onPress={handleAddNew}
            >
              <Plus size={16} color="#4B5563" />
              <Text classN={`ml-2 text-gray-700`}>Add New Log</Text>
            </TouchableOpacity>

            <View style={tw`h-px bg-gray-200 my-1`} />

            <TouchableOpacity
              style={tw`flex-row items-center py-2 px-3`}
              onPress={handleCompare}
            >
              <BarChart3 size={16} color="#4B5563" />
              <Text classN={`ml-2 text-gray-700`}>Compare</Text>
            </TouchableOpacity>

            <View style={tw`h-px bg-gray-200 my-1`} />

            <TouchableOpacity
              style={tw`flex-row items-center py-2 px-3`}
              onPress={handleHeaderDelete}
            >
              <Trash2 size={16} color="#EF4444" />
              <Text classN={`ml-2 text-red-500`}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Month Header with Calendar Toggle */}
      <View
        style={tw`flex-row justify-between items-center px-4 py-3 border-b border-gray-200`}
      >
        <Text fontWeight="bold" fontSize={18}>
          Scan & Diary -{" "}
          {currentMonth.toLocaleDateString("en-US", { month: "long" })}
        </Text>
        <TouchableOpacity onPress={toggleCalendar}>
          <Calendar size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Date Pills Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`border-b border-gray-200 py-3`}
        contentContainerStyle={tw`px-4`}
      >
        {datePills.map((pill, index) => {
          const isSelected =
            selectedDate.getDate() === pill.date.getDate() &&
            selectedDate.getMonth() === pill.date.getMonth() &&
            selectedDate.getFullYear() === pill.date.getFullYear();

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedDate(pill.date);
                setShowTooltip(false);
              }}
              style={[
                tw`rounded-2xl border border-gray-200 mx-2 p-3 items-center min-w-[80px]`,
                isSelected && tw`bg-blue-50 border-blue-200`,
              ]}
            >
              <Text fontWeight="bold" fontSize={14} classN="mb-1">
                {pill.date.toLocaleDateString("en-US", { month: "short" })}
              </Text>
              <Text classN="text-gray-500 text-sm mb-2">
                {pill.date.getDate()}
              </Text>

              {pill.hasScan && pill.scanImage && (
                <Image
                  source={pill.scanImage}
                  style={tw`w-12 h-12 rounded-full border-2 border-white shadow-sm`}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Animated Calendar View */}
      {showCalendar && (
        <Animated.View
          style={[
            tw`border-b border-gray-200 overflow-hidden`,
            {
              height: calendarHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 320],
              }),
            },
          ]}
        >
          <View style={tw`px-4 py-4`}>
            {/* Month Navigation */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <TouchableOpacity onPress={() => navigateMonth("prev")}>
                <ChevronLeft size={24} color="#000" />
              </TouchableOpacity>

              <Text fontWeight="bold" fontSize={18} classN="text-center">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>

              <TouchableOpacity onPress={() => navigateMonth("next")}>
                <ChevronRight size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Weekday Headers */}
            <View style={tw`flex-row justify-between mb-2`}>
              {weekdays.map((day) => (
                <View key={day} style={tw`w-10 items-center`}>
                  <Text classN="text-gray-500 text-xs font-medium">{day}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={tw`flex-row flex-wrap justify-between`}>
              {calendarDates.map((day, index) => {
                const scans = getScansForDate(day.date);
                const isSelected =
                  selectedDate.getDate() === day.date.getDate() &&
                  selectedDate.getMonth() === day.date.getMonth() &&
                  selectedDate.getFullYear() === day.date.getFullYear();
                const isToday =
                  new Date().getDate() === day.date.getDate() &&
                  new Date().getMonth() === day.date.getMonth() &&
                  new Date().getFullYear() === day.date.getFullYear();

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (day.isCurrentMonth) {
                        setSelectedDate(day.date);
                        setShowTooltip(false);
                        toggleCalendar();
                      }
                    }}
                    style={[
                      tw`w-10 h-10 rounded-full items-center justify-center mb-2`,
                      !day.isCurrentMonth && tw`opacity-30`,
                      isSelected && tw`bg-blue-500`,
                      isToday && !isSelected && tw`border-2 border-blue-300`,
                    ]}
                  >
                    <Text
                      classN={
                        isSelected
                          ? "text-white font-bold"
                          : isToday
                          ? "text-blue-500 font-bold"
                          : "text-gray-800"
                      }
                      fontSize={14}
                    >
                      {day.date.getDate()}
                    </Text>
                    {scans.length > 0 && (
                      <View
                        style={tw`w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 ${
                          isSelected ? "bg-white" : ""
                        }`}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Selected Date Info */}
      <View style={tw`px-4 py-3 bg-gray-50`}>
        <Text classN="text-gray-600">
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>

      {/* Saved Scans List */}
      <FlatList
        data={getScansForDate(selectedDate)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={tw`p-4`}
        numColumns={3}
        columnWrapperStyle={tw`justify-between mb-4`}
        renderItem={({ item }) => (
          <View
            style={tw`w-[30%] bg-white rounded-lg p-3 shadow-sm border border-gray-100`}
          >
            {/* Image */}
            <Image
              source={item.image}
              style={tw`w-full h-24 rounded-lg mb-2`}
              resizeMode="cover"
            />

            {/* Title and Description */}
            <View style={tw`mb-2`}>
              <Text
                fontWeight="bold"
                fontSize={12}
                classN="mb-1"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text classN="text-gray-500 text-xs" numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            {/* Score */}
            <View
              style={tw`bg-blue-100 px-2 py-1 rounded-full self-start mb-2`}
            >
              <Text classN="text-blue-600 font-bold text-xs">
                {item.score}%
              </Text>
            </View>

            {/* Tool Icon */}
            <TouchableOpacity
              style={tw`absolute top-2 right-2 bg-white rounded-full p-1 shadow-md`}
              onPress={() => handleToolIconPress(item.id)}
            >
              <MoreVertical size={16} color="#000" />
            </TouchableOpacity>

            {/* Tooltip */}
            {showTooltip && selectedScanId === item.id && (
              <View
                style={tw`absolute top-8 right-2 bg-white rounded-lg p-2 shadow-lg z-10 border border-gray-200`}
              >
                <TouchableOpacity
                  style={tw`py-1 px-2`}
                  onPress={() => handleDeleteScan(item.id)}
                >
                  <Text classN="text-red-500 text-xs">Delete</Text>
                </TouchableOpacity>
                <View style={tw`h-px bg-gray-200 my-1`} />
                <TouchableOpacity style={tw`py-1 px-2`}>
                  <Text classN="text-gray-700 text-xs">Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-20 w-full`}>
            <Text classN="text-gray-500 text-center mb-2">
              No scans for this date
            </Text>
            <Text classN="text-gray-400 text-center">
              Take a scan to track your skin progress
            </Text>
          </View>
        }
      />

      {/* Backdrop to close tooltips when tapping outside */}
      {(showTooltip || showHeaderTooltip) && (
        <TouchableOpacity
          style={tw`absolute inset-0 z-10`}
          activeOpacity={1}
          onPress={() => {
            setShowTooltip(false);
            setShowHeaderTooltip(false);
          }}
        />
      )}
    </View>
  );
};

export default JournalDetails;
