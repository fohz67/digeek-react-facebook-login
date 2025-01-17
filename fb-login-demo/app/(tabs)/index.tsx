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

const PERMISSIONS = ["public_profile", "email"];

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [tok, setTok] = useState(null);

  useEffect(() => {
    req();
  }, []);

  const req = async () => {
      const { status } = await requestTrackingPermissionsAsync();

      Settings.initializeSDK();
      status === "granted" && await Settings.setAdvertiserTrackingEnabled(true);
  }

  const login = async () => {
    if (await LoginManager.logInWithPermissions(PERMISSIONS)) {
      const tok = await AccessToken.getCurrentAccessToken();
      const user = await Profile.getCurrentProfile();
      
      tok && setTok(tok);
      user && setUser(user);
    }
  };

  const logout = () => {
    LoginManager.logOut();
    setUser(null);
    setTok(null);
  };

  const item = (key, value) => {
    if (!value) {
      return null;
    }

    if (key === "imageURL" && value) {
      return (
        <Image key={key} source={{ uri: value }} style={styles.profileImage} />
      );
    }

    return (
      <Text key={key} style={styles.text}>
        {key}: {value?.toString()}
      </Text>
    );
  };

  if (!user || !tok) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login With Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        {Object.entries(user).map(([key, value]) => item(key, value))}
        <Text style={styles.text}>Token: {tok.accessToken}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
    height: "100%",
    backgroundColor: "#fff",
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
    alignSelf: "flex-start",
  },
});
