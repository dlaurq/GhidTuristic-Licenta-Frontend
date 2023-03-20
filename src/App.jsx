import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider,
  Routes
} from "react-router-dom"
import AdminLayout from "./layouts/AdminLayout"
import RootLayout from "./layouts/RootLayout"
import Counties from "./pages/Admin/Counties/Counties"
import Countries from "./pages/Admin/Countries/Countries"
import Cities from "./pages/Admin/Cities/Cities"
import Home from "./pages/Home"
import Locations from "./pages/Admin/Locations/Locations"
import Register from "./pages/Auth/Register"
import Login from "./pages/Auth/Login"
import RequireAuth from "./components/RequireAuth"
import Partener from "./pages/Partener/Partener"
import PersistLogin from "./components/PersistLogin"
import Missing from "./pages/Missing"
import Entities from "./pages/Entities/Entities"

function App() {



  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<RootLayout />}>

          {/**Public routes */}
          <Route path="/" element={<Home />}/>
          <Route path="register" element={<Register />}/>
          <Route path="login" element={<Login />}/>
          <Route path="obiective" element={ <Entities /> } />

          {/**Private routes */}
          
            <Route element={<RequireAuth allowedRoles={[420]} />}>
              <Route path="admin" element={<AdminLayout />}>
                <Route path="country" element={<Countries />} />
                <Route path="county" element={<Counties />} />
                <Route path="city" element={<Cities />} />
                <Route path="locations" element={<Locations />} />
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
