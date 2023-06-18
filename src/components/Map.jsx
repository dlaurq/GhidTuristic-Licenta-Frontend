import { MapContainer, TileLayer} from 'react-leaflet'

const Map = ({children, center=[45.9432, 24.9668], zoom=6}) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {children}

        
      </MapContainer>
  )
}

export default Map