import React, { useState } from "react";
import { Button, StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showWebView, setShowWebView] = useState(false);

  const FACEBOOK_APP_ID = "979882983997083";
  const FACEBOOK_REDIRECT_URI = "https://www.facebook.com/connect/login_success.html";

  const loginWithFacebook = () => {
    setShowWebView(true);
  };

  const handleNavigationStateChange = (event: any) => {
    if (event.url.startsWith(FACEBOOK_REDIRECT_URI)) {
      const params = new URLSearchParams(event.url.split("#")[1]);
      const accessToken = params.get("access_token");

      if (accessToken) {
        fetchFacebookUserInfo(accessToken);
        setShowWebView(false);
      }
    }
  };

  const fetchFacebookUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`
      );
      const data = await response.json();
      setUserInfo({
        id: data.id,
        name: data.name,
        email: data.email || "Email non disponible",
        picture: data.picture.data.url,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur :", error);
    }
  };

  const logout = () => {
    setUserInfo(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!userInfo && (
        <Button title="Se connecter avec Facebook" onPress={loginWithFacebook} />
      )}
      {userInfo && (
        <View style={styles.card}>
          <Text style={styles.infoText}>Nom : {userInfo.name}</Text>
          <Text style={styles.infoText}>Email : {userInfo.email}</Text>
          <Text style={styles.infoText}>ID : {userInfo.id}</Text>
          <Button title="Déconnexion" onPress={logout} color="#FF5733" />
        </View>
      )}
      {showWebView && (
        <WebView
          source={{
            uri: `https://www.facebook.com/v15.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&response_type=token&scope=public_profile,email`,
          }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
          style={styles.webview}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  webview: {
    width: "100%",
    height: 500,
  },
});
