import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { useEffect, useState } from "react"
import EntityCard from "../components/EntityCard"
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gpx/gpx.js'
import Gpx from "../components/Gpx"

const Home = () => {

  const [recomandari, setRecomandari] = useState({topRest: [], topRec: [], topHotel: [], topTrasee: []})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecomandari = async () => {
      try{
        const res = await axios.get('/recomandari')
        console.log(res.data)
        setRecomandari({...recomandari, ...res.data})
      }catch(err){
        console.log(err)
      }
    }
    fetchRecomandari()

  }, [])


  return (


    <section className="min-h-screen sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]">

      <div className="p-5"></div>

      {/**HARTA */}
      <MapContainer center={[45.9432, 24.9668]} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {recomandari.topRest?.map(entity =>entity.lat && entity.lng &&
          <Marker key={entity.id} position={[entity.lat, entity.lng]}>
            <Popup >
              <EntityCard className='!p-0' entity={entity}/>
            </Popup>
          </Marker>
        )}

        {recomandari.topHotel?.map(entity =>entity.lat && entity.lng &&
          <Marker key={entity.id} position={[entity.lat, entity.lng]}>
            <Popup >
              <EntityCard className='!p-0' entity={entity}/>
            </Popup>
          </Marker>
        )}

        {recomandari.topRec?.map(entity =>entity.lat && entity.lng &&
          <Marker key={entity.id} position={[entity.lat, entity.lng]}>
            <Popup >
              <EntityCard className='!p-0' entity={entity}/>
            </Popup>
          </Marker>
        )}

        {recomandari.topTrasee?.map(entity =>entity.lat && entity.lng &&
          <Marker key={entity.id} position={[entity.lat, entity.lng]}>
            <Popup >
              <EntityCard className='!p-0' entity={entity}/>
            </Popup>
          </Marker>
        )}
      </MapContainer>
        
      <div className="p-5"></div>

      <button onClick={() => navigate(('/obiective'))} className="bg-gray-900 border-gray-900 border-2 font-bold mx-auto  block">Exploreaza</button>

      {/**Liste recomandari */}
      <section className="p-5 text-xl">

        {recomandari?.topRec?.length !== 0 && 
          <section className="">
            <p className="font-bold text-2xl mb-2">Top Recomandari</p>
            
          </section>
        }

        {recomandari?.topRest?.length !== 0 && 
          <section className="">
            <p className="font-bold text-2xl mb-2">Top Restaurante</p>
            <section className="flex flex-row justify-start overflow-auto my-5 sm:gap-5  ">
              {recomandari?.topRest?.map(item => <EntityCard className='min-w-fit last:border-b-2' key={item.id} entity={item} />)}
            </section>
          </section>
        }

        {recomandari?.topHotel?.length !== 0 && 
          <section>
            <p className="font-bold text-2xl mb-2">Top Hoteluri</p>
            <section className="flex flex-row justify-start overflow-auto my-5 sm:gap-5 ">
              {recomandari?.topHotel?.map(item => <EntityCard className='min-w-fit last:border-b-2' key={item.id} entity={item} />)}
            </section>
          </section>
        }

        {recomandari?.topActiv?.length !== 0 && 
        <section>
          <p className="font-bold text-2xl mb-2">Top Activitati</p>
          <section className="flex flex-row overflow-y-auto gap-5 justify-start items-center">
            {recomandari?.topActiv?.map(item => <EntityCard className='min-w-[15rem]' key={item.id} entity={item} />)}
          </section>
        </section>
        }

        {recomandari?.topOrase?.length !== 0 && 
          <section>
            <p className="font-bold text-2xl mb-2">Top Orase</p>
          </section>
        }
      </section>
        
      
    </section>
    
  )
}

export default Home