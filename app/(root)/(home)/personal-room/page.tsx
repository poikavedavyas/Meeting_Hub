'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useGetCallById } from '@/hooks/useGetCallById'
import { useUser } from '@clerk/nextjs'
import { useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/Loader'

const Table = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-white lg:text-xl xl:min-w-32">
        {title}
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl text-white">
        {description}
      </h1>
    </div>
  )
}

const PersonalRoom = () => {
  const { user, isLoaded } = useUser()
  const client = useStreamVideoClient()
  const router = useRouter()
  const { toast } = useToast()

  // ⛔ Guard FIRST
  if (!isLoaded || !user) {
    return <Loader />
  }

  const meetingId = user.id
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`

  // ✅ Hook is called ONLY when meetingId exists
  const { call } = useGetCallById(meetingId)

  const startRoom = async () => {
    if (!client) return

    if (!call) {
      const newCall = client.call('default', meetingId)
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      })
    }

    router.push(`/meeting/${meetingId}?personal=true`)
  }

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>

      <div className="flex w-full flex-col gap-8 xl:max-w-225">
        <Table
          title="Topic"
          description={`${user.firstName || 'My'}'s Meeting Room`}
        />
        <Table title="Meeting ID" description={meetingId} />
        <Table title="Invite Link" description={meetingLink} />
      </div>

      <div className="flex gap-5">
        <Button className="bg-blue-600" onClick={startRoom}>
          Start Meeting
        </Button>

        <Button
          className="bg-blue-600"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({ title: 'Link Copied' })
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  )
}

export default PersonalRoom
