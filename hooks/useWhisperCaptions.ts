import { useEffect, useRef, useState } from "react"

export function useWhisperCaptions(enabled: boolean, language: string) {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [caption, setCaption] = useState("")

  useEffect(() => {
    if (!enabled) {
      console.log("[Captions] Disabled - stopping mic")
      recorderRef.current?.stop()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      recorderRef.current = null
      streamRef.current = null
      return
    }

    const startRecording = async () => {
      try {
        console.log("[Captions] Requesting microphone access...")
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        console.log("[Captions] Microphone access granted:", stream)

        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
        recorderRef.current = recorder

        recorder.ondataavailable = async (e) => {
          if (!e.data.size) return
          console.log("[Captions] Audio chunk available, sending to backend...")

          const formData = new FormData()
          formData.append("file", e.data)
          formData.append("language", language)

          try {
            const res = await fetch("/api/speech-to-text", { method: "POST", body: formData })
            const data = await res.json()
            console.log("[Captions] Backend response:", data)

            if (data.text) {
              setCaption((prev) => prev + " " + data.text)
            }
          } catch (err) {
            console.error("[Captions] Error calling Whisper API:", err)
          }
        }

        recorder.start(7000) // 7-second chunks
        console.log("[Captions] MediaRecorder started")
      } catch (err) {
        console.error("[Captions] Failed to access microphone:", err)
      }
    }

    startRecording()

    return () => {
      console.log("[Captions] Cleanup - stopping recorder and mic")
      recorderRef.current?.stop()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      recorderRef.current = null
      streamRef.current = null
    }
  }, [enabled, language])

  return caption
}
