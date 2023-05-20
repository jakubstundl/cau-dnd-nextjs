
import React from 'react'
import Image from 'next/image'

const MapTile = ({tileType}:{tileType:string}):JSX.Element => {
  return (
    <Image src={`/maps/${tileType}.jpg`} draggable={false} alt={tileType} width={100} height={100}
      className="w-full h-full"
    ></Image>
  )
}

export default MapTile