'use client'

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void
}) => {
  const call = useCall()

  if (!call) {
    throw new Error('useCall must be used within StreamCall')
  }

  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)

  // Mic control
  useEffect(() => {
    if (isMicOn) {
      call.microphone.enable()
    } else {
      call.microphone.disable()
    }
  }, [isMicOn])

  // Camera control
  useEffect(() => {
    if (isCameraOn) {
      call.camera.enable()
    } else {
      call.camera.disable()
    }
  }, [isCameraOn])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-1 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>

      <div className="scale-75 origin-center ">
        <VideoPreview />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Mic Button */}
        <button
          onClick={() => setIsMicOn((prev) => !prev)}
          className={`rounded-full p-4 transition ${
            isMicOn ? 'bg-blue-600' : 'bg-red-600'
          }`}
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </button>

        {/* Camera Button */}
        <button
          onClick={() => setIsCameraOn((prev) => !prev)}
          className={`rounded-full p-4 transition ${
            isCameraOn ? 'bg-blue-600' : 'bg-red-600'
          }`}
        >
          {isCameraOn ? <Video /> : <VideoOff />}
        </button>

        <DeviceSettings />
      </div>

      {/* Join Button */}
      <Button
        className="mt-4 rounded-md bg-green-500 px-8 py-4"
        onClick={() => {
          call.join()
          setIsSetupComplete(true)
        }}
      >
        Join Meeting
      </Button>
    </div>
  )
}

export default MeetingSetup
