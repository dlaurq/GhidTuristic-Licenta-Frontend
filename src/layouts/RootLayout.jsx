import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import MainNav from "../components/MainNav"

const RootLayout = () => {
  return (
    <>
        <header className="min-h-[20vh]">
            <MainNav />
        </header>
        <main className="min-h-[80vh]">
            <Outlet />
        </main>
        <Footer />
    </>
  )
}

export default RootLayout