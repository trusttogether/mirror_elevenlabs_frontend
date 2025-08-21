import { View, Text } from "react-native";
import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/drawer/CustomDrawer";

const DrawerLayout = () => {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: "front",
        drawerStyle: {
          backgroundColor: "#FFFFFF",
          width: "80%",
          borderRadius: 0,
        },
      }}
    >
      <Drawer.Screen name="scan" options={{ headerShown: false }} />
      <Drawer.Screen name="my-journal" options={{ headerShown: false }} />
      <Drawer.Screen name="my-challenges" options={{ headerShown: false }} />
      <Drawer.Screen name="notifications" options={{ headerShown: false }} />
      <Drawer.Screen name="settings" options={{ headerShown: false }} />
    </Drawer>
  );
};

export default DrawerLayout;
