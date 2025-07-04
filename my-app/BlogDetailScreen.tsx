import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "./supabaseClient";
import { RootStackParamList } from "./App";
import Markdown from "@ronradtke/react-native-markdown-display";

type Props = NativeStackScreenProps<RootStackParamList, "BlogDetail">;

type Post = {
  id: number;
  title: string;
  summary: string | null;
  content: string | null;
  created_at: string;
};

const ACCENT_COLORS = ["#6366F1", "#F472B6", "#34D399", "#F59E0B"];

function BlogDetailScreen({ route }: Props) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("posts")
      .select("id, title, summary, content, created_at")
      .eq("id", postId)
      .single();

    if (error) {
      setError("글을 불러오는 중 오류가 발생했습니다.");
      setPost(null);
    } else {
      setPost(data as Post);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? "글을 찾을 수 없습니다."}
        </Text>
      </View>
    );
  }

  const accentColor = ACCENT_COLORS[post.id % ACCENT_COLORS.length];
  const dateStr = new Date(post.created_at).toLocaleDateString("ko-KR");
  const markdownStyles = createMarkdownStyles(accentColor);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerLabel}>POST DETAIL</Text>
        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.dateRow}>
          <View style={[styles.dateDot, { backgroundColor: accentColor }]} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        {post.summary && <Text style={styles.summary}>{post.summary}</Text>}
      </View>

      <View
        style={[
          styles.card,
          {
            borderTopColor: accentColor,
          },
        ]}
      >
        <Markdown style={markdownStyles}>
          {post.content ?? "내용이 없습니다."}
        </Markdown>
      </View>
    </ScrollView>
  );
}

export default BlogDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
  },
  header: {
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 6,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
  },
  summary: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderTopWidth: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
});

function createMarkdownStyles(accentColor: string) {
  return StyleSheet.create({
    body: {
      fontSize: 15,
      lineHeight: 22,
      color: "#111827",
    },
    heading1: {
      fontSize: 22,
      fontWeight: "700",
      marginTop: 18,
      marginBottom: 8,
      color: "#111827",
    },
    heading2: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 16,
      marginBottom: 6,
      color: "#111827",
    },
    heading3: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 14,
      marginBottom: 4,
      color: "#111827",
    },
    paragraph: {
      marginBottom: 10,
    },
    bullet_list: {
      marginBottom: 8,
      paddingLeft: 6,
    },
    ordered_list: {
      marginBottom: 8,
      paddingLeft: 6,
    },
    code_inline: {
      backgroundColor: "#F3F4F6",
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: "monospace",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    code_block: {
      backgroundColor: "#F3F4F6",
      padding: 10,
      borderRadius: 8,
      fontFamily: "monospace",
      marginBottom: 12,
      borderLeftWidth: 3,
      borderLeftColor: accentColor,
    },
    strong: {
      fontWeight: "700",
      color: "#111827",
    },
    em: {
      fontStyle: "italic",
    },
    link: {
      color: accentColor,
      textDecorationLine: "underline",
    },
  });
}
