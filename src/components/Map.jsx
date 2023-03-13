import { GoogleMap } from '@react-google-maps/api'
import React, { useCallback, useMemo, useRef } from 'react'



const Map = () => {
    const mapRef = useRef()
    const center = useMemo(() => ({ lat: 46 , lng: 25 }), []) 
    const options = useMemo(() => ({
        mapId: "351ca23d4a4fdd3d",
        disableDefaultUI: true,
        clickableIcons: false,
    }), [])

    const onLoad = useCallback(map => mapRef.current = map)

    return (
        <GoogleMap 
                    zoom={6} 
                    center={center} 
                    mapContainerClassName="w-full h-screen"
                    options={options}
                    onLoad={onLoad}
                ></GoogleMap>
    )
}

export default Map