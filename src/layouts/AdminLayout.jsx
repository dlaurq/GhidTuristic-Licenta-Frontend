import { Outlet } from "react-router-dom"
import AdminNav from "../components/AdminNav"


const AdminLayout = () => {
  return (
    <section>
        <AdminNav />
        <Outlet />
    </section>
  )
}

export default AdminLayout