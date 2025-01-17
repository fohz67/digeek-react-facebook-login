import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  LoginManager,
  Settings,
  Profile,
} from "react-native-fbsdk-next";

export default function HomeScreen() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      Settings.initializeSDK();
      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    })();
  }, []);

  const loginWithFacebook = async () => {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (!result.isCancelled) {
      const tokenData = await AccessToken.getCurrentAccessToken();
      console.log("Access Token:", tokenData);
      const profile = await Profile.getCurrentProfile();
      console.log("Profile Info:", profile);
      setUserProfile(profile);
    }
  };

  const logout = () => {
    LoginManager.logOut();
    setUserProfile(null);
  };

  return (
    <View style={styles.container}>
      {!userProfile ? (
        <TouchableOpacity style={styles.button} onPress={loginWithFacebook}>
          <Text style={styles.buttonText}>Login With Facebook</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            {Object.entries(userProfile).map(([key, value]) => {
              if (key === "imageURL" && value) {
                return (
                  <Image
                    key={key}
                    source={{ uri: value }}
                    style={styles.profileImage}
                  />
                );
              }
              return (
                <Text key={key} style={styles.text}>
                  {key}: {value?.toString() || "N/A"}
                </Text>
              );
            })}
          </View>

          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
    overflow: "scroll",
    marginTop: 50,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#1877F2",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    width: "80%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "left",
  },
});