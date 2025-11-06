import { useState } from 'react'
import PortSelector from '../PortSelector'

export default function PortSelectorExample() {
  const [selectedPort, setSelectedPort] = useState("COM3")
  const [baudRate, setBaudRate] = useState("9600")
  const [isConnected, setIsConnected] = useState(false)

  return (
    <PortSelector
      availablePorts={["COM3", "COM4", "COM5"]}
      selectedPort={selectedPort}
      baudRate={baudRate}
      onPortChange={setSelectedPort}
      onBaudRateChange={setBaudRate}
      onRefresh={() => console.log("Refresh ports")}
      onConnect={() => setIsConnected(!isConnected)}
      isConnected={isConnected}
    />
  )
}
