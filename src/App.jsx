import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider
} from "react-router-dom"
import AdminLayout from "./layouts/AdminLayout"
import RootLayout from "./layouts/RootLayout"
import Countries from "./pages/Admin/Countries/Countries"
import Home from "./pages/Home"

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />}/>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="country" element={<Countries />}/>
        </Route>
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
