import {useEffect} from 'react'
import {useMap} from 'react-leaflet'
import 'leaflet-gpx'

const Gpx = ({ src, options }) => {
    const map = useMap()
  
    useEffect(() => {
      if (!map) return
  
      const gpxLayer = new L.GPX(src, {
        marker_options: {
          startIconUrl: '',
          endIconUrl: '',
          shadowUrl: ''
          }
      })
      gpxLayer.addTo(map)
  
      return () => {
        map.removeLayer(gpxLayer)
      };
    }, [map, src, options])
  
    return null
  }

export default Gpx