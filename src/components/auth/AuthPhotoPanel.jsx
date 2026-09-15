export default function AuthPhotoPanel({ imageUrl }) {
  return (
    <div
      className="relative hidden flex-1 overflow-hidden bg-cover bg-center md:block"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        filter: "saturate(0.88) contrast(1.04)",
      }}
    >
      <div className="absolute inset-0 bg-teal-900/25" />
    </div>
  );
}