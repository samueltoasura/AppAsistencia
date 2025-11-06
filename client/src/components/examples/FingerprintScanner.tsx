import FingerprintScanner from '../FingerprintScanner'

export default function FingerprintScannerExample() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FingerprintScanner status="idle" message="Esperando..." />
      <FingerprintScanner status="scanning" message="Escaneando huella..." />
      <FingerprintScanner status="success" message="Huella reconocida" />
      <FingerprintScanner status="error" message="Huella no encontrada" />
    </div>
  )
}
