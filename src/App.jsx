import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider
} from "react-router-dom"
import AdminLayout from "./layouts/AdminLayout"
import RootLayout from "./layouts/RootLayout"
import Counties from "./pages/Admin/Counties/Counties"
import Countries from "./pages/Admin/Countries/Countries"
import Cities from "./pages/Admin/Cities/Cities"
import Home from "./pages/Home"

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />}/>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="country" element={<Countries />}/>
          <Route path="county" element={<Counties />}/>
          <Route path="city" element={<Cities />}/>
        </Route>
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
