import { cn } from '@/lib/utils';
import Image from 'next/image'

interface HomeCardProps {
    className : string,
    img : string,
    title : string,
    description : string,
    handleClick : () => void;
}

const HomeCard = ({img, className, description, handleClick, title} : HomeCardProps) => {
  return (
    <div
    className={cn(' px-4 py-6 flex flex-col justify-between w-full min-h-65 rounded-[14px] cursor-pointer', className)}
    onClick={handleClick}>
    {/* Icon */}
    <div className="flex-center w-12 h-12 bg-white/50 rounded-[10px]">
            <Image
                src={img}
                width={28}
                height={28}
                alt="meeting"
                className="ml-2 mt-3"
            />
            </div>

            {/* Text at bottom */}
            <div className="flex flex-col gap-2 mt-auto">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-lg font-normal">{description}</p>
            </div>
    </div>
)
}

export default HomeCard