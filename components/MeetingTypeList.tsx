'use client'

import Image from "next/image"
import HomeCard from "./HomeCard"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MeetingModel from "./MeetingModel"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "./ui/use-toast"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from 'react-datepicker'
import { Input } from "./ui/input"

type MeetingStateType = 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<MeetingStateType>()
    const { user } = useUser()
    const client = useStreamVideoClient()
    const { toast } = useToast()

    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    })
    const [callDetails, setCallDetails] = useState<Call>()
    const [showCreatedModal, setShowCreatedModal] = useState(false)

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    const createMeeting = async () => {
        if (!user || !client) return

        try {
            if (!values.dateTime) {
                toast({ title: "Please select a Date and Time" })
                return
            }

            const id = crypto.randomUUID()
            const call = client.call('default', id)
            if (!call) throw new Error("Failed to create Call")

            const startsAt = values.dateTime.toISOString()
            const description = values.description || 'Instant Meeting'

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: { description }
                }
            })

            setCallDetails(call)

            if (meetingState === 'isScheduleMeeting') {
                // Show "Meeting Created" modal first
                setShowCreatedModal(true)
            } else if (meetingState === 'isInstantMeeting') {
                // Instant meeting → join immediately
                router.push(`/meeting/${call.id}`)
            }

            toast({ title: "Meeting Created" })
        } catch (error) {
            console.log(error)
            toast({ title: "Failed to create meeting" })
        }
    }

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {/* Home Cards */}
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant Meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
                className="bg-orange-400"
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your Meeting"
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className="bg-blue-500"
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Checkout your Recordings"
                handleClick={() => router.push('/recordings')}
                className="bg-purple-800"
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className="bg-yellow-400"
            />

            {/* Scheduled Meeting Modal */}
            {meetingState === 'isScheduleMeeting' && !showCreatedModal && (
                <MeetingModel
                    isOpen={true}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    handleClick={createMeeting}
                >
                    <div className="flex flex-col gap-2.5">
                        <label className="text-base text-normal leading-5.5">Add Description</label>
                        <Textarea
                            className="border-none bg-blue-900 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onChange={(e) => setValues({ ...values, description: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col w-full gap-2.5">
                        <label className="text-base text-normal leading-5.5">Select Date and Time</label>
                        <ReactDatePicker
                            className="bg-blue-900 rounded w-full p-2 focus:outline-none"
                            selected={values.dateTime}
                            onChange={(date: Date | null) =>
                                setValues({ ...values, dateTime: date ?? new Date() })
                            }
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </div>
                </MeetingModel>
            )}

            {/* Meeting Created Modal */}
            {showCreatedModal && (
                <MeetingModel
                    isOpen={true}
                    onClose={() => {
                        setShowCreatedModal(false)
                        setMeetingState(undefined)
                    }}
                    title="Meeting Created"
                    buttonText="Copy Meeting Link"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink)
                        toast({ title: "Link copied!" })
                    }}
                    image="/icons/checked.svg"
                    className="text-center"
                />
            )}

            {/* Instant Meeting Modal */}
            {meetingState === 'isInstantMeeting' && !showCreatedModal && (
                <MeetingModel
                    isOpen={true}
                    onClose={() => setMeetingState(undefined)}
                    title="Start an Instant Meeting"
                    buttonText="Start Meeting"
                    className="text-center"
                    handleClick={createMeeting}
                />
            )}

            {/* Join Meeting Modal */}
            <MeetingModel
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                buttonText="Join Meeting"
                className="text-center"
                handleClick={() => {
                    if (!values.link) {
                        toast({ title: 'Please enter a meeting link' })
                        return
                    }
                    router.push(values.link)
                }}
            >
                <Input
                    placeholder="Meeting link"
                    className="border-none bg-blue-900 text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                />
            </MeetingModel>
        </section>
    )
}

export default MeetingTypeList
