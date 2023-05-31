import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
  Routes
} from "react-router-dom"
import AdminLayout from "./layouts/AdminLayout"
import RootLayout from "./layouts/RootLayout"
import Counties from "./pages/Admin/Counties"
import Countries from "./pages/Admin/Countries"
import Cities from "./pages/Admin/Cities"
import Home from "./pages/Home"
import Locations from "./pages/Admin/Locations"
import Register from "./pages/Auth/Register"
import Login from "./pages/Auth/Login"
import RequireAuth from "./components/RequireAuth"
import Partener from "./pages/Partener/Partener"
import PersistLogin from "./components/PersistLogin"
import Missing from "./pages/Missing"
import Entities from "./pages/Entities/Entities"
import Entity from "./pages/Entities/Entity"
import Users from "./pages/Admin/Users"
import AdminEntities from "./pages/Admin/AdminEntities"
import Categories from "./pages/Admin/Categories"
import Cont from "./pages/Cont"

function App() {



  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<RootLayout />}>

          {/**Public routes */}
          <Route path="/" element={<Home />}/>
          <Route path="register" element={<Register />}/>
          <Route path="login" element={<Login />}/>
          <Route path="obiective/:name" element={ <Entity /> } />
          <Route path="obiective" element={ <Entities /> } />
          <Route path="cont" element={ <Cont /> } />

          {/**Private routes */}
          
            <Route element={<RequireAuth allowedRoles={[420]} />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route path="country" element={<Countries />} />
                <Route path="county" element={<Counties />} />
                <Route path="city" element={<Cities />} />
                <Route path="locations" element={<Locations />} />
                <Route path="users" element={<Users />} />
                <Route path="entities" element={<AdminEntities />} />
                <Route path="categories" element={<Categories />} />
              </Route>
            </Route>
          


          <Route path="partener" element={ <Partener /> } />



          {/**404 route */}
          <Route path="*" element={ <Missing /> } />

        </Route>
      </Route>
    </Routes>
  )
}

export default App
