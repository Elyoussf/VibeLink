import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { 
  Button, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  TextInput, 
  SafeAreaView, 
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [savedVideo, setSavedVideo] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterPrompt, setFilterPrompt] = useState('');
  const [isProcessingFilter, setIsProcessingFilter] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  useEffect(() => {
    requestMediaPermission();
  }, []);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRecording) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);
  
  // Effect to create a temporary file for ephemeral saving
  useEffect(() => {
    if (recordedVideo) {
      saveVideoToTempDirectory();
    }
    
    return () => {
      // Clean up temp files when component unmounts
      if (savedVideo) {
        FileSystem.deleteAsync(savedVideo, { idempotent: true }).catch(err => console.log('Error deleting temp file', err));
      }
    };
  }, [recordedVideo]);
  
  if (!permission || !mediaPermission) {
    return <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FF2D55" />
    </View>;
  }
  
  if (!permission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          style={styles.gradientBackground}
        >
          <Text style={styles.permissionTitle}>TikTok-Style Video App</Text>
          <Text style={styles.permissionMessage}>We need camera and media library permissions to create your awesome videos</Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={() => {
              requestPermission();
              requestMediaPermission();
            }}
          >
            <Text style={styles.permissionButtonText}>Grant Permissions</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
  
  async function saveVideoToTempDirectory() {
    try {
      // Create a temporary file to store the video
      const tempDir = FileSystem.cacheDirectory + 'tempVideos/';
      const dirInfo = await FileSystem.getInfoAsync(tempDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
      }
      
      const tempFilePath = tempDir + `video_${Date.now()}.mp4`;
      await FileSystem.copyAsync({
        from: recordedVideo!,
        to: tempFilePath
      });
      
      setSavedVideo(tempFilePath);
    } catch (error) {
      console.error('Error saving temporary video:', error);
    }
  }
  
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  
  async function startRecording() {
    if (cameraRef.current) {
      setIsRecording(true);
      setCountdown(5);
      setRecordedVideo(null);
      setSavedVideo(null);
      
      const video = await cameraRef.current.recordAsync({
        maxDuration: 5,
        quality: '720p',
      });
      
      setRecordedVideo(video.uri);
    }
  }
  
  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }
  
  function resetCamera() {
    setRecordedVideo(null);
    setSavedVideo(null);
    setFilter(null);
  }
  
  async function applyAIFilter() {
    // In a real app, this would call an AI service API
    setIsProcessingFilter(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setFilter(filterPrompt);
      setIsProcessingFilter(false);
      setFilterModalVisible(false);
    }, 2000);
  }
  
  async function saveVideoToGallery() {
    try {
      if (savedVideo) {
        await MediaLibrary.saveToLibraryAsync(savedVideo);
        alert('Video saved to gallery!');
      }
    } catch (error) {
      console.error('Error saving to gallery:', error);
      alert('Failed to save video');
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {!savedVideo ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          videoStabilizationMode="auto"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradientOverlay}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.appTitle}>5-Sec Clips</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              {isRecording ? (
                <View style={styles.recordingContainer}>
                  <View style={styles.pulsingCircle}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                  </View>
                  <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                    <MaterialIcons name="stop" size={36} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.controls}>
                  <TouchableOpacity style={styles.circleButton} onPress={toggleCameraFacing}>
                    <Ionicons name="camera-reverse" size={28} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.recordButton} 
                    onPress={startRecording}
                  >
                    <View style={styles.recordButtonInner} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleButton} onPress={() => setFilterModalVisible(true)}>
                    <MaterialIcons name="filter" size={28} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </LinearGradient>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          {filter && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterText}>
                <MaterialIcons name="auto-fix-high" size={16} color="#FFF" /> {filter}
              </Text>
            </View>
          )}
          
          <Video
            ref={videoRef}
            source={{ uri: savedVideo }}
            style={styles.videoPreview}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.previewGradient}
          >
            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.previewButton} onPress={resetCamera}>
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.previewButtonText}>Reshoot</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewButton} onPress={() => setFilterModalVisible(true)}>
                <MaterialIcons name="filter" size={24} color="white" />
                <Text style={styles.previewButtonText}>AI Filter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.previewButton} onPress={saveVideoToGallery}>
                <Ionicons name="save" size={24} color="white" />
                <Text style={styles.previewButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* AI Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#6A11CB', '#2575FC']}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Video Filter</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Describe the filter you want to apply to your video
            </Text>
            
            <TextInput
              style={styles.promptInput}
              placeholder="E.g., Neon cyberpunk style"
              placeholderTextColor="#A0A0A0"
              value={filterPrompt}
              onChangeText={setFilterPrompt}
              multiline
            />
            
            <View style={styles.filterSuggestions}>
              <Text style={styles.suggestionsTitle}>Quick Styles:</Text>
              <View style={styles.suggestionsRow}>
                {['Vintage', 'Glitch', 'Vaporwave', 'Anime'].map((suggestion) => (
                  <TouchableOpacity 
                    key={suggestion}
                    style={styles.suggestionChip}
                    onPress={() => setFilterPrompt(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyAIFilter}
              disabled={isProcessingFilter || !filterPrompt.trim()}
            >
              {isProcessingFilter ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: '#FF2D55',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  camera: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF2D55',
  },
  recordingContainer: {
    alignItems: 'center',
  },
  pulsingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,45,85,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF2D55',
    marginBottom: 30,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF2D55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoPreview: {
    flex: 1,
  },
  previewGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 30,
  },
  previewButton: {
    alignItems: 'center',
  },
  previewButtonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  promptInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    height: 80,
  },
  filterSuggestions: {
    marginBottom: 30,
  },
  suggestionsTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  suggestionText: {
    color: 'white',
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#FF2D55',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterBadge: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  filterText: {
    color: 'white',
    fontSize: 14,
  },
});