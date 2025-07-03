import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "./supabaseClient";
import { RootStackParamList } from "./App";

type Props = NativeStackScreenProps<RootStackParamList, "BlogList">;

type Post = {
  id: number;
  title: string;
  summary: string | null;
  created_at: string;
};

const ACCENT_COLORS = ["#6366F1", "#F472B6", "#34D399", "#F59E0B"];

function BlogListScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("posts")
      .select("id, title, summary, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      setError("글 목록을 불러오는 중 오류가 발생했습니다.");
    } else {
      setPosts(data as Post[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderItem = ({ item }: { item: Post }) => {
    const accentColor = ACCENT_COLORS[item.id % ACCENT_COLORS.length];
    const dateStr = new Date(item.created_at).toLocaleDateString("ko-KR");

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.itemContainer, { borderLeftColor: accentColor }]}
        onPress={() => navigation.navigate("BlogDetail", { postId: item.id })}
      >
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>

        {item.summary && (
          <Text style={styles.itemSummary} numberOfLines={2}>
            {item.summary}
          </Text>
        )}

        <View style={styles.itemFooter}>
          <View style={styles.dateWrapper}>
            <View style={[styles.dateDot, { backgroundColor: accentColor }]} />
            <Text style={styles.itemDate}>{dateStr}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>등록된 글이 아직 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>MY BLOG</Text>
        <Text style={styles.headerTitle}>블로그 게시글</Text>
        <Text style={styles.headerSubtitle}>
          새로운 글이 올라오면 여기에서 확인할 수 있어요.
        </Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default BlogListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // 밝은 배경
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
    color: "#6B7280",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,

    // 부드러운 그림자
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  itemSummary: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },
  itemFooter: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  itemDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#6366F1",
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
