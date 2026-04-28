const BackgroundVideo = ({
  src = "/home-video.mp4"
}) => {
  return (
    <>
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" />
    </>
  );
};

export default BackgroundVideo;