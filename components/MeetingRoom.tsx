'use client'

import { cn } from '@/lib/utils'
import { useWhisperCaptions } from '@/hooks/useWhisperCaptions'
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutList, Users } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './ui/Loader'
import { useCall } from '@stream-io/video-react-sdk'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const searchParams = useSearchParams()
  const isPersonalRoom = !!searchParams.get('personal')
  const router = useRouter()
  const call = useCall()

  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [language, setLanguage] = useState('en')

  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()

  // ✅ Use Whisper hook
  const captionText = useWhisperCaptions(captionsOn, language)

  if (callingState !== CallingState.JOINED) return <Loader />

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="left" />
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="right" />
      default:
        return <PaginatedGridLayout />
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-250 items-center">
          <CallLayout />
        </div>

        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            block: showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* LIVE CAPTIONS */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <span className="bg-black/80 px-4 py-2 rounded-lg text-center max-w-3xl block">
          {captionsOn ? captionText || 'Listening...' : ''}
        </span>
      </div>

      {/* CONTROLS */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-4 flex-wrap">
        <CallControls onLeave={() => router.push('/')} />

        {/* LAYOUT */}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[#19232d] text-white">
            {[
              { label: 'Grid', value: 'grid' },
              { label: 'Speaker Left', value: 'speaker-left' },
              { label: 'Speaker Right', value: 'speaker-right' },
            ].map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => setLayout(item.value as CallLayoutType)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        {/* PARTICIPANTS */}
        <button onClick={() => setShowParticipants((p) => !p)}>
          <div className="rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} />
          </div>
        </button>

        {/* LANGUAGE SELECT */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded bg-[#19232d] px-3 py-2 text-white"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ml">Malayalam</option>
          <option value="ta">Tamil</option>
        </select>

        {/* CAPTIONS TOGGLE */}
        <button
          onClick={() => setCaptionsOn((p) => !p)}
          className={`px-4 py-2 rounded ${
            captionsOn ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          {captionsOn ? 'Captions ON' : 'Captions OFF'}
        </button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom
