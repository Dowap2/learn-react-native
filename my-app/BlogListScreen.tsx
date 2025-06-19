import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "./supabaseClient";
import { RootStackParamList } from "./App"; // 실제 경로에 맞게 수정

type Props = NativeStackScreenProps<RootStackParamList, "BlogList">;

type Post = {
  id: number;
  title: string;
  summary: string | null;
  created_at: string;
};

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
    return (
      <TouchableOpacity
        style={styles.itemContainer}
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
        <Text style={styles.itemDate}>
          {new Date(item.created_at).toLocaleDateString("ko-KR")}
        </Text>
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
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

export default BlogListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  itemSummary: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#999",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 14,
    color: "#555",
  },
});
