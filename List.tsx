import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function List({ question, answer }: FAQItemProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded(!expanded);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <View style={styles.accordionList}>
      <TouchableOpacity onPress={toggle}>
        <View style={styles.accordionHeader}>
          <Text style={styles.accordionTitle}>{question}</Text>
          <Text>{expanded ? "-" : "+"}</Text>
        </View>
        {expanded && (
          <View style={styles.accordionContent}>
            <Text>{answer}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  accordionList: {
    backgroundColor: "#EEF4FF",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  accordionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accordionTitle: { color: "#191F28", fontSize: 16, fontWeight: "bold" },
  accordionContent: {
    color: "#191F28CC",
    marginTop: 10,
  },
});
