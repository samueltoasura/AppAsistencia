import ConnectionStatus from '../ConnectionStatus'

export default function ConnectionStatusExample() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ConnectionStatus isConnected={true} port="COM3" baudRate="9600" />
      <ConnectionStatus isConnected={false} />
    </div>
  )
}
