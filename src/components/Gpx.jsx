import {useEffect} from 'react'
import {useMap} from 'react-leaflet'
import 'leaflet-gpx'

const Gpx = ({ src, options }) => {
    const map = useMap()
  
    useEffect(() => {
      if (!map) return
  
      const gpxLayer = new L.GPX(src, options)
      console.log(gpxLayer)
      gpxLayer.addTo(map)
  
      return () => {
        map.removeLayer(gpxLayer)
      };
    }, [map, src, options])
  
    return null
  }

export default Gpx