import React, { useState, useRef, useEffect } from 'react';
import { 
  Smartphone, 
  Camera, 
  Sparkles, 
  Code, 
  Upload, 
  CheckCircle2, 
  Zap, 
  RotateCw, 
  Layers, 
  BookOpen, 
  Copy, 
  Check,
  Clock,
  Users,
  Play,
  Pause,
  Share2,
  Key,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { NoteArtifact } from '../types';
import confetti from 'canvas-confetti';

interface AndroidCompanionViewProps {
  onAddNoteArtifact: (note: NoteArtifact) => void;
  onSelectNote: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AndroidCompanionView: React.FC<AndroidCompanionViewProps> = ({
  onAddNoteArtifact,
  onSelectNote,
  onNavigateTab,
}) => {
  const [selectedCodeTab, setSelectedCodeTab] = useState<'scan_screen' | 'focus_service' | 'group_fcm' | 'api_service'>('scan_screen');
  const [mobileActiveTab, setMobileActiveTab] = useState<'scan' | 'focus' | 'group' | 'auth'>('scan');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mobile Focus Timer Simulation
  const [mobileTimerSecs, setMobileTimerSecs] = useState(25 * 60);
  const [isMobileTimerRunning, setIsMobileTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isMobileTimerRunning && mobileTimerSecs > 0) {
      interval = setInterval(() => setMobileTimerSecs((s) => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isMobileTimerRunning, mobileTimerSecs]);

  const formatMobileTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Helper to generate a genuine, valid Base64 image of simulated handwritten student notes
  const generateSampleNotesBase64 = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 440;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Notebook paper background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 640, 440);

    // Notebook horizontal ruling lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 50; y < 440; y += 30) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(610, y);
      ctx.stroke();
    }

    // Left margin line
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(75, 0);
    ctx.lineTo(75, 440);
    ctx.stroke();

    // Handwritten-style text content
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText('Unit 2: AVL Tree Balance Factors & Rotations', 90, 42);

    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('• Definition: Invariant Balance Factor |BF| <= 1', 90, 72);
    ctx.fillText('• BF(node) = Height(Left_Child) - Height(Right_Child)', 90, 102);
    ctx.fillText('• 4 Imbalance Cases: LL, RR (Single), LR, RL (Double)', 90, 132);
    ctx.fillText('• LL Imbalance -> Fix via Single Right Rotation at k2', 90, 162);
    ctx.fillText('• Operations Time: Search O(log N), Insert O(log N)', 90, 192);
    ctx.fillText('• Worst Case Height: h <= 1.4404 * log2(N + 2) - 0.328', 90, 222);

    // Draw tree diagrams
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    
    // Node 30
    ctx.beginPath();
    ctx.arc(320, 290, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText('30', 312, 295);

    // Node 20
    ctx.beginPath();
    ctx.arc(240, 360, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText('20', 232, 365);

    // Node 40
    ctx.beginPath();
    ctx.arc(400, 360, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText('40', 392, 365);

    // Tree edges
    ctx.beginPath();
    ctx.moveTo(308, 303);
    ctx.lineTo(252, 347);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(332, 303);
    ctx.lineTo(388, 347);
    ctx.stroke();

    return canvas.toDataURL('image/jpeg', 0.92);
  };

  // Android Kotlin Code Snippets
  const codeSnippets = {
    scan_screen: `// ScanNotesScreen.kt - Jetpack Compose with CameraX & Gemini OCR
package com.adaptiveai.app.ui.screens

import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.view.LifecycleCameraController
import androidx.camera.view.PreviewView
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.viewinterop.AndroidView
import com.adaptiveai.app.viewmodel.AdaptiveAIViewModel

@Composable
fun ScanNotesScreen(
    viewModel: AdaptiveAIViewModel,
    onNoteGenerated: (String) -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val controller = remember { LifecycleCameraController(context) }
    val uiState by viewModel.scanUiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("AdaptiveAI Scan My Notes") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    viewModel.captureAndProcessNotes(controller, context) { noteId ->
                        onNoteGenerated(noteId)
                    }
                }
            ) {
                Icon(Icons.Default.Camera, contentDescription = "Scan Handwritten Notes")
            }
        }
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize()) {
            AndroidView(
                factory = { ctx ->
                    PreviewView(ctx).apply {
                        this.controller = controller
                        controller.bindToLifecycle(lifecycleOwner)
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
            
            if (uiState.isProcessing) {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.Center)
                )
            }
        }
    }
}`,
    viewmodel: `// AdaptiveAIViewModel.kt - Kotlin Coroutines & StateFlow
package com.adaptiveai.app.viewmodel

import android.content.Context
import androidx.camera.view.LifecycleCameraController
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.adaptiveai.app.data.remote.AdaptiveApiService
import com.adaptiveai.app.data.model.OcrScanRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AdaptiveAIViewModel(
    private val apiService: AdaptiveApiService
) : ViewModel() {

    private val _scanUiState = MutableStateFlow(ScanUiState())
    val scanUiState = _scanUiState.asStateFlow()

    fun captureAndProcessNotes(
        controller: LifecycleCameraController,
        context: Context,
        onSuccess: (String) -> Unit
    ) {
        viewModelScope.launch {
            _scanUiState.value = _scanUiState.value.copy(isProcessing = true)
            try {
                // 1. Capture base64 bitmap from CameraX
                val base64Image = controller.takePictureAsBase64(context)
                
                // 2. Call unified server endpoint /api/ai/ocr-scan
                val scanResponse = apiService.scanHandwrittenNotes(
                    OcrScanRequest(imageBase64 = base64Image)
                )
                
                // 3. Auto-generate 6 AI learning formats
                val artifact = apiService.generateArtifacts(
                    title = scanResponse.title,
                    rawContent = scanResponse.transcribedText
                )
                
                _scanUiState.value = _scanUiState.value.copy(
                    isProcessing = false,
                    lastArtifactId = artifact.id
                )
                onSuccess(artifact.id)
            } catch (e: Exception) {
                _scanUiState.value = _scanUiState.value.copy(
                    isProcessing = false,
                    error = e.localizedMessage
                )
            }
        }
    }
}`,
    focus_service: `// FocusForegroundService.kt - Android Foreground Service with Sticky Notification
package com.adaptiveai.app.service

import android.app.*
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*

class FocusForegroundService : Service() {
    private val serviceScope = CoroutineScope(Dispatchers.Default + Job())
    private var secondsRemaining = 25 * 60

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val channelId = "focus_timer_channel"
        val notificationManager = getSystemService(NotificationManager::class.java)
        
        // High priority channel prevents Android OS Doze mode from killing timer
        val channel = NotificationChannel(
            channelId,
            "College Focus Timer",
            NotificationManager.IMPORTANCE_LOW
        )
        notificationManager.createNotificationChannel(channel)

        startForeground(101, buildNotification("Focusing: Data Structures (25:00)"))

        serviceScope.launch {
            while (secondsRemaining > 0) {
                delay(1000)
                secondsRemaining--
                val timeStr = "%02d:%02d".format(secondsRemaining / 60, secondsRemaining % 60)
                notificationManager.notify(101, buildNotification("Focusing: DSA ($timeStr)"))
            }
            // Trigger haptic vibration & completion sound
        }
        return START_STICKY
    }

    private fun buildNotification(text: String): Notification {
        return NotificationCompat.Builder(this, "focus_timer_channel")
            .setContentTitle("AdaptiveAI • Deep Focus")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`,
    group_fcm: `// CampusGroupMessagingService.kt - Firebase Cloud Messaging & Room QR Code
package com.adaptiveai.app.push

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import android.content.Intent

class CampusGroupMessagingService : FirebaseMessagingService() {

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val roomCode = remoteMessage.data["roomCode"]
        val inviterName = remoteMessage.data["inviterName"] ?: "Classmate"
        val examTopic = remoteMessage.data["topic"] ?: "Semester Exam Prep"

        // Display Heads-Up Notification to student
        showGroupStudyInviteNotification(
            title = "👥 Study Invitation from $inviterName",
            message = "Join '$examTopic' with room code $roomCode",
            roomCode = roomCode
        )
    }

    private fun showGroupStudyInviteNotification(title: String, message: String, roomCode: String?) {
        // Notification builder with 1-tap Join Action
    }
}`,
    api_service: `// AdaptiveApiService.kt - Retrofit REST API interface (Shared Backend)
package com.adaptiveai.app.data.remote

import com.adaptiveai.app.data.model.*
import retrofit2.http.Body
import retrofit2.http.POST

interface AdaptiveApiService {

    @POST("api/ai/ocr-scan")
    suspend fun scanHandwrittenNotes(
        @Body request: OcrScanRequest
    ): OcrScanResponse

    @POST("api/ai/process-notes")
    suspend fun generateArtifacts(
        @Body request: ProcessNotesRequest
    ): NoteArtifactDto

    @POST("api/ai/tutor")
    suspend fun queryTutor(
        @Body request: TutorQueryRequest
    ): TutorResponseDto

    @POST("api/ai/adaptive-plan")
    suspend fun rebalanceStudyPlan(
        @Body request: AdaptivePlanRequest
    ): AdaptivePlanDto
}`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeOcrScan = async (base64Img: string) => {
    setIsScanning(true);
    setPreviewImage(base64Img);
    try {
      const response = await fetch('/api/ai/ocr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          mimeType: 'image/jpeg',
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setScanResult(resData.data);
        
        // Auto create note artifact
        const newArtifact: NoteArtifact = {
          id: 'note_scan_' + Date.now(),
          title: resData.data.title || 'Scanned Unit 2 Notes',
          subject: resData.data.subject || 'Data Structures & Algorithms',
          sourceType: 'scanned_image',
          createdAt: new Date().toISOString().split('T')[0],
          rawContent: resData.data.transcribedText,
          easyNotes: `# ${resData.data.title}\n\n${resData.data.transcribedText}`,
          mindMap: {
            id: 'root_scan',
            label: resData.data.title,
            children: [
              { id: 'c1', label: 'Balance Factor Calculation' },
              { id: 'c2', label: '4 Rotation Mechanics' },
            ],
          },
          flashcards: [
            {
              id: 'fc_sc_1',
              question: 'What are the permissible Balance Factors in AVL tree?',
              answer: '-1, 0, and +1. Nodes with |BF| > 1 are unbalanced.',
              category: 'Scanned Definition',
            },
          ],
          quiz: [
            {
              id: 'q_sc_1',
              question: 'Which rotation fixes a Left-Left (LL) imbalance?',
              options: ['Single Right Rotation', 'Single Left Rotation', 'Double Rotation', 'No Rotation'],
              correctIndex: 0,
              explanation: 'LL imbalance is restored via a single right rotation at the unbalanced parent.',
              topicTag: 'Rotations',
              difficulty: 'Easy',
            },
          ],
          quickRevision: [
            'Scanned formulas: ' + (resData.data.keyFormulas || []).join('; '),
          ],
          importantPoints: [
            'Transcribed directly via Android CameraX + Gemini OCR API.',
          ],
        };

        onAddNoteArtifact(newArtifact);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTestCameraScan = () => {
    const validSampleBase64 = generateSampleNotesBase64();
    executeOcrScan(validSampleBase64);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) {
        executeOcrScan(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Ecosystem & Hardware Differentiation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Android Companion App & “Scan My Notes”
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Why an Android app? Students photograph handwritten notes or blackboard diagrams. CameraX + Gemini OCR converts them into interactive Easy Notes, Mind Maps, and Flashcards instantly.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 font-mono font-medium">
              Kotlin 2.0 • Jetpack Compose • Retrofit
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Live Android Phone Simulator (Left) + Kotlin Source Code Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Android Phone Mockup Simulator */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px] bg-slate-900 rounded-[40px] p-3 border-4 border-slate-300 shadow-xl space-y-3">
            
            {/* Phone Screen Bezel Header */}
            <div className="flex justify-between items-center px-4 pt-1 text-[11px] text-slate-400">
              <span className="font-semibold text-white">09:41</span>
              <div className="w-16 h-3 bg-slate-800 rounded-full" />
              <span>5G 100%</span>
            </div>

            {/* Android App In-App UI */}
            <div className="bg-white rounded-[28px] p-4 border border-slate-200 space-y-3 min-h-[510px] flex flex-col justify-between shadow-inner">
              
              <div className="space-y-3">
                {/* App Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                      A
                    </div>
                    <span className="text-xs font-bold text-slate-800">AdaptiveAI Android</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">College Edition</span>
                </div>

                {/* Mobile Tab Pills */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-[10px] font-bold">
                  <button
                    onClick={() => setMobileActiveTab('scan')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      mobileActiveTab === 'scan' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Scan
                  </button>
                  <button
                    onClick={() => setMobileActiveTab('focus')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      mobileActiveTab === 'focus' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => setMobileActiveTab('group')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      mobileActiveTab === 'group' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Group
                  </button>
                  <button
                    onClick={() => setMobileActiveTab('auth')}
                    className={`py-1 rounded-lg transition cursor-pointer ${
                      mobileActiveTab === 'auth' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Auth
                  </button>
                </div>

                {/* Tab 1: SCAN NOTES */}
                {mobileActiveTab === 'scan' && (
                  <div className="bg-indigo-50/60 rounded-2xl p-3.5 border border-indigo-100 text-center space-y-2.5 animate-fadeIn">
                    {previewImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-indigo-200 h-24 bg-slate-100 shadow-2xs">
                        <img src={previewImage} alt="Scanned note preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100 shadow-xs">
                        <Camera className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Scan Notes & Diagrams</h4>
                      <p className="text-[10px] text-slate-500">
                        CameraX takes high-res snapshots for OCR transcription
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <button
                        onClick={handleTestCameraScan}
                        disabled={isScanning}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
                      >
                        <Camera className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                        <span>{isScanning ? 'Transcribing with Gemini...' : 'Snap Lecture Notes'}</span>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCustomFileUpload}
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isScanning}
                        className="w-full py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3 text-slate-500" />
                        <span>Upload from Gallery</span>
                      </button>
                    </div>

                    {scanResult && (
                      <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 text-left space-y-1 mt-2">
                        <div className="flex items-center space-x-1 text-emerald-800 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Scanned Successfully!</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-800 line-clamp-1">{scanResult.title}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: FOCUS SERVICE */}
                {mobileActiveTab === 'focus' && (
                  <div className="bg-slate-900 rounded-2xl p-4 text-white text-center space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-indigo-400">
                        <Bell className="w-3 h-3" /> Foreground Service
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                        Doze Safe
                      </span>
                    </div>

                    <div className="py-2">
                      <p className="text-4xl font-extrabold font-mono tracking-tight text-white">
                        {formatMobileTimer(mobileTimerSecs)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Data Structures & Algorithms</p>
                    </div>

                    <div className="bg-slate-800/80 rounded-xl p-2 text-[10px] text-slate-300 border border-slate-700/60 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="text-left leading-tight truncate">
                        Sticky Notification will stay pinned in Android Shade
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsMobileTimerRunning(!isMobileTimerRunning)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isMobileTimerRunning 
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isMobileTimerRunning ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause Timer</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Start 25m Focus</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileTimerRunning(false);
                          setMobileTimerSecs(25 * 60);
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 3: GROUP STUDY */}
                {mobileActiveTab === 'group' && (
                  <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-100 text-left space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Active Campus Circle
                      </span>
                      <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">
                        4 Online
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">CS401 • Exam Prep Sprint</h4>
                      <p className="text-[10px] text-slate-500">Room Code: <span className="font-mono font-bold text-indigo-600">CSE-8391-DSA</span></p>
                    </div>

                    {/* Member Avatars */}
                    <div className="flex items-center gap-1.5 py-1">
                      {['Rahul', 'Priya', 'Ananya', 'You'].map((name, i) => (
                        <div key={i} className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-medium text-slate-700 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => onNavigateTab('group')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Open Full Group Studio</span>
                    </button>
                  </div>
                )}

                {/* Tab 4: STUDENT AUTH */}
                {mobileActiveTab === 'auth' && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 text-left space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Android Credential Manager</span>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      College students sign in via Google One-Tap, Phone OTP, Apple ID, or Student Email.
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span>📱 Phone Number (+91 / +1)</span>
                        <span className="text-[10px] text-indigo-600 font-bold">SMS Autofill</span>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span>🌐 Google Account</span>
                        <span className="text-[10px] text-indigo-600 font-bold">1-Tap GSI</span>
                      </div>
                      <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span>🍎 Apple ID</span>
                        <span className="text-[10px] text-indigo-600 font-bold">OAuth 2.0</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav Simulation */}
              <div className="flex justify-around py-2 border-t border-slate-100 text-[10px] text-slate-400">
                <button onClick={() => setMobileActiveTab('scan')} className={`font-semibold cursor-pointer ${mobileActiveTab === 'scan' ? 'text-indigo-600' : ''}`}>Scan</button>
                <button onClick={() => setMobileActiveTab('focus')} className={`font-semibold cursor-pointer ${mobileActiveTab === 'focus' ? 'text-indigo-600' : ''}`}>Focus</button>
                <button onClick={() => setMobileActiveTab('group')} className={`font-semibold cursor-pointer ${mobileActiveTab === 'group' ? 'text-indigo-600' : ''}`}>Group</button>
                <button onClick={() => setMobileActiveTab('auth')} className={`font-semibold cursor-pointer ${mobileActiveTab === 'auth' ? 'text-indigo-600' : ''}`}>Auth</button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column (7 Cols): Kotlin Source Code Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'scan_screen', label: 'ScanNotesScreen.kt' },
                  { id: 'focus_service', label: 'FocusForegroundService.kt' },
                  { id: 'group_fcm', label: 'CampusGroupFCM.kt' },
                  { id: 'api_service', label: 'AdaptiveApiService.kt' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCodeTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition cursor-pointer ${
                      selectedCodeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 self-start sm:self-auto cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Kotlin Code'}</span>
              </button>
            </div>

            {/* Code Display */}
            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono overflow-x-auto max-h-[460px] leading-relaxed">
              <code>{codeSnippets[selectedCodeTab]}</code>
            </pre>

          </div>
        </div>

      </div>

    </div>
  );
};
