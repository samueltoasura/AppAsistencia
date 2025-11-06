import DeleteFingerprintControl from '../DeleteFingerprintControl'

export default function DeleteFingerprintControlExample() {
  return (
    <DeleteFingerprintControl
      onDeleteSpecific={(id) => console.log("Delete fingerprint ID:", id)}
      onDeleteAll={() => console.log("Delete all fingerprints")}
    />
  )
}
