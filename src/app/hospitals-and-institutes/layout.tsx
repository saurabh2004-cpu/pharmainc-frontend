import Navbar from "../../components/navbar.tsx/navbar"


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="">
            <Navbar bg="bg-white" />
            <div className=" w-full px-0 ">
                {children}
            </div>
        </div>
    )
}

export default Layout