import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

function ContactScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert("문의하기", "문의 내용을 입력해 주세요.");
      return;
    }

    Alert.alert("문의하기", "문의가 접수되었습니다. 감사합니다!");
    setEmail("");
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>문의하기</Text>
      <Text style={styles.description}>
        궁금한 점이나 불편한 점이 있다면 자유롭게 남겨주세요.
      </Text>

      <Text style={styles.label}>이메일 (선택)</Text>
      <TextInput
        style={styles.input}
        placeholder="답변을 받을 이메일을 입력하세요."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>문의 내용</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="어떤 점이 궁금하신가요?"
        value={message}
        onChangeText={setMessage}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>문의 보내기</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: "#F9F9F9",
    fontSize: 14,
  },
  textarea: {
    height: 140,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
