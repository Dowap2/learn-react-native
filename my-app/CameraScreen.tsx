import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";

export default function Camera() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<"front" | "back">("back");

  const [imageUri, setImageUri] = useState<string | null>(null);

  const takePhoto = async () => {
    if (!cameraPermission?.granted) {
      const { granted } = await requestCameraPermission();
      if (!granted) {
        Alert.alert("권한 필요", "카메라 권한을 허용해주세요.");
        return;
      }
    }
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      if (photo?.uri) setImageUri(photo.uri);
    } catch (e) {
      console.warn(e);
      Alert.alert("오류", "사진을 촬영할 수 없어요.");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("오류", "갤러리에서 이미지를 불러올 수 없어요.");
    }
  };

  const rotate90 = async () => {
    if (!imageUri) return;
    const { uri } = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ rotate: 90 }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    setImageUri(uri);
  };

  const mirror = async () => {
    if (!imageUri) return;
    const { uri } = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ flip: ImageManipulator.FlipType.Horizontal }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    setImageUri(uri);
  };

  const resize1080w = async () => {
    if (!imageUri) return;
    const { uri } = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1080 } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );
    setImageUri(uri);
  };

  // 4) 갤러리에 저장
  const saveToGallery = async () => {
    if (!imageUri) return;
    if (!mediaPermission?.granted) {
      const { granted } = await requestMediaPermission();
      if (!granted) {
        Alert.alert("권한 필요", "갤러리 저장 권한을 허용해주세요.");
        return;
      }
    }
    try {
      await MediaLibrary.saveToLibraryAsync(imageUri);
      Alert.alert("저장 완료", "갤러리에 저장했어요!");
    } catch (e) {
      console.warn(e);
      Alert.alert("오류", "저장에 실패했어요.");
    }
  };

  // UI
  if (!imageUri) {
    // 촬영/선택 전: 카메라 화면
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.smallBtn}
            onPress={() => setFacing((p) => (p === "back" ? "front" : "back"))}
          >
            <Text style={styles.btnTxt}>전/후</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutter} onPress={takePhoto} />
          <TouchableOpacity style={styles.smallBtn} onPress={pickImage}>
            <Text style={styles.btnTxt}>갤러리</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 촬영/선택 후: 미리보기 + 간단 편집
  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 16 }}
        />
        <View style={{ height: 12 }} />
        <View style={styles.row}>
          <TouchableOpacity style={styles.actionBtn} onPress={rotate90}>
            <Text style={styles.btnTxt}>회전 90°</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={mirror}>
            <Text style={styles.btnTxt}>미러</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={resize1080w}>
            <Text style={styles.btnTxt}>가로 1080px</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 8 }} />
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.actionBtn, { flex: 1 }]}
            onPress={saveToGallery}
          >
            <Text style={styles.btnTxt}>갤러리에 저장</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { flex: 1, backgroundColor: "#444" }]}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.btnTxt}>다시 찍기 / 선택</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "#aaa", marginTop: 10, fontSize: 12 }}>
          * 회전/미러/리사이즈는 결과 파일에 반영됩니다.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  smallBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
  },
  btnTxt: { color: "#fff", fontWeight: "600" },
  row: { flexDirection: "row", gap: 10 },
  actionBtn: {
    backgroundColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
});
