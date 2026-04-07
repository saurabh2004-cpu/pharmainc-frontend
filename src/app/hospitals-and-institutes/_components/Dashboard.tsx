import Image from "next/image"


const Dashboard = () => {
    return (
        <div className="z-30  w-full absolute top-150 sm:top-140  xl:top-180 flex justify-center pointer-events-none">
            <Image
                src="/hospitals-and-institutes/dashboard-1.png"
                alt="Dashboard Mockup"
                width={1920}
                height={1080}
                className="w-full max-w-[20rem] md:max-w-[35rem] lg:max-w-[48rem] xl:max-w-[48rem] rounded-2xl shadow-2xl object-cover"
            />
        </div>
    )
}

export default Dashboard
