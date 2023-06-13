import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useEffect, useState } from "react"
import EntityCard from "../components/EntityCard"

const Home = () => {

  const [recomandari, setRecomandari] = useState({topRest: [], topRec: [], topHotel: [], topActiv: [], topOrase: []})

  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecomandari = async () => {
      try{
        const res = await api.get('/recomandari')
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