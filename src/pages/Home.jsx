import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { useEffect, useState } from "react"
import EntityCard from "../components/EntityCard"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import ReactMapGl, {Marker, Popup, Source, Layer} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css' 
//import RoBorders from '../GeoJSONs/RO_BORDERS.geojson'

const Home = () => {

  const [recomandari, setRecomandari] = useState({topRest: [], topRec: [], topHotel: [], topActiv: [], topOrase: []})
  const [entities, setEntities] = useState([])
  const [entitiInfo, setEntitiInfo] = useState(null)
  const [viewport, setViewport] = useState({
    latitude: 45.9432,
    longitude: 24.9668,
    zoom: 6,
  })

  const api = useAxiosPrivate()
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

    const fetchEntities = async () => {
      try{
        const res = await api.get('/places')
        setEntities(res.data)
        console.log(res.data)
      }catch(err){
        console.log(err)
      }
    }

    fetchRecomandari()
    fetchEntities()
  }, [])


  return (


    <section className="min-h-screen sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]">
      <div className="p-5"></div>
      <section>
        <ReactMapGl 
          {...viewport}
          onMove={evt => setViewport(evt.viewport)}
          style={{width: '100%', height: '80vh'}}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapStyle='mapbox://styles/dlaurq/clivjzr5p012g01pfh1e0ggud' 
          asyncRender={true}
          
        >
          {entities?.map(entity =>entity.lat && entity.lng &&
            <Marker 
              
              key={entity.id}
              latitude={entity.lat}
              longitude={entity.lng}
              anchor="bottom"
              onClick={e => {
                // If we let the click event propagates to the map, it will immediately close the popup
                // with `closeOnClick: true`
                e.originalEvent.stopPropagation();
                setEntitiInfo(entity);
                
              }}
            ></Marker>
            )}

          {entitiInfo && (
            <Popup
              className='bg-transparent'
              anchor="top"
              longitude={entitiInfo.lng}
              latitude={entitiInfo.lat}
              onClose={() => setEntitiInfo(null)}
            >
              <EntityCard entity={entitiInfo} className=''/>
            </Popup>
          )}
          

          <Source id='RO_BORDERS' type="geojson" data='/gadm41_ROU_1.json'>
            <Layer id='RO_BORDERS-fill' type='line' source='RO_BORDERS' paint= {{'line-color': 'white', 'line-opacity': 0.8}} />
          </Source>
        </ReactMapGl>
      </section>

      <div className="p-5"></div>
      <button onClick={() => navigate(('/obiective'))} className="bg-gray-900 border-gray-900 border-2 font-bold mx-auto  block">Exploreaza</button>
      <section className="p-5 text-xl">

        {recomandari?.topRec?.length !== 0 && 
          <section className="">
            <p>Top Recomandari</p>
            
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
            <p>Top Hoteluri</p>
            <section className="flex flex-row justify-start overflow-auto my-5 sm:gap-5 ">
              {recomandari?.topHotel?.map(item => <EntityCard className='min-w-fit last:border-b-2' key={item.id} entity={item} />)}
            </section>
          </section>
        }

        {recomandari?.topActiv?.length !== 0 && 
        <section>
          <p>Top Activitati</p>
          <section className="flex flex-row overflow-y-auto gap-5 justify-start items-center">
            {recomandari?.topActiv?.map(item => <EntityCard className='min-w-[15rem]' key={item.id} entity={item} />)}
          </section>
        </section>
        }

        {recomandari?.topOrase?.length !== 0 && 
          <section>
            <p>Top Orase</p>
          </section>
        }
      </section>
        
      
    </section>
    
  )
}

export default Home