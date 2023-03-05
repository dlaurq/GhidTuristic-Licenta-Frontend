import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import MainNav from "../components/MainNav"

const RootLayout = () => {
  return (
    <>
        <header>
            <MainNav />
        </header>
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
  )
}

export default RootLayout