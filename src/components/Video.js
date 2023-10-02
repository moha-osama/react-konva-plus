import React from "react";
import { Layer, Image } from "react-konva";
import Konva from "konva";

const Video = ({ src, containerRef, videoURL }) => {
  const imageRef = React.useRef(null);
  const [size, setSize] = React.useState({ width: 50, height: 50 });

  const videoElement = React.useMemo(() => {
    const element = document.createElement("video");
    element.src = src;
    return element;
  }, [src]);

  React.useEffect(() => {
    const onload = function () {
      setSize({
        width: containerRef.current.offsetWidth,
        height: 600,
      });
    };
    videoElement.addEventListener("loadedmetadata", onload);
    return () => {
      videoElement.removeEventListener("loadedmetadata", onload);
    };
  }, [videoElement]);

  React.useEffect(() => {
    const layer = imageRef.current.getLayer();

    const anim = new Konva.Animation(() => {}, layer);
    anim.start();

    return () => anim.stop();
  }, [videoElement]);

  return (
    <Layer>
      <Image
        ref={imageRef}
        image={videoElement}
        x={0}
        y={0}
        stroke="red"
        width={size.width}
        height={size.height}
        onClick={(preState) => videoElement.play()}
        style={{ objectFit: "contain" }}
      />
    </Layer>
  );
};

export default Video;
