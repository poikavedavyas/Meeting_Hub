import MeetingTypeList from '@/components/MeetingTypeList';


const Home = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US',{hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full'})).format(now);
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
        <div className='h-65 w-full rounded-4xl bg-[url("/images/image123.jpg")] bg-cover'>
          <div className='flex h-full flex-col  justify-between max-md:px-5 max-md:py-8 lg:p-11'>
            <h2 className=" rounded-py-2 text-right text-base font-normal lg:text-3xl">Upcoming Meeting 12:30 PM</h2>
            <div className='flex flex-col gap-2'>
              <h1 className='text-4xl font-extrabold lg:text-6xl'>
                {time}
              </h1>
              <p className='text-lg font-medium lg:text-2xl'>{date}</p>
            </div>
          </div>
        </div>

        <MeetingTypeList />
    </section>
  )
}

export default Home