import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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
      console.log(error);
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{post.title}</Text>

      <Text style={styles.date}>
        {new Date(post.created_at).toLocaleDateString("ko-KR")}
      </Text>

      {post.summary && <Text style={styles.summary}>{post.summary}</Text>}

      <View style={styles.separator} />

      <Markdown style={markdownStyles}>
        {post.content ?? "내용이 없습니다."}
      </Markdown>
    </ScrollView>
  );
}

export default BlogDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    fontSize: 14,
    color: "red",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
  },
  summary: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 16,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#222",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 10,
  },
  code_inline: {
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 6,
    fontFamily: "monospace",
    marginBottom: 12,
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
});
