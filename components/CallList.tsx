'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './ui/Loader';
import { toast } from 'sonner';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upcomingCalls;
      case 'recordings':
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (type !== 'recordings') return;

    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast.error('Try again later');
      }
    };

    fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => {
          const isRecording = 'url' in meeting;

          return (
            <MeetingCard
              key={isRecording ? meeting.session_id : meeting.id}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                  ? '/icons/upcoming.svg'
                  : '/icons/recordings.svg'
              }
              title={
                !isRecording
                  ? meeting.state?.custom?.description
                  : meeting.filename?.substring(0, 20) || 'Personal Meeting'
              }
              date={
                !isRecording
                  ? meeting.state?.startsAt?.toLocaleString() ?? '—'
                  : meeting.start_time?.toLocaleString() ?? '—'
              }

              isPreviousMeeting={type === 'ended'}
              link={
                isRecording
                  ? meeting.url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
              }
              buttonIcon1={isRecording ? '/icons/play.svg' : undefined}
              buttonText={isRecording ? 'Play' : 'Start'}
              handleClick={
                isRecording
                  ? () => router.push(meeting.url)
                  : () => router.push(`/meeting/${meeting.id}`)
              }
            />
          );
        })
      ) : (
        <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
