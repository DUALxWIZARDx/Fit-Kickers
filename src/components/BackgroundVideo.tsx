export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-25 filter grayscale contrast-125"
        src="/videos/hero-bg.mp4"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-zinc-950/85 to-black" />
    </div>
  );
}
