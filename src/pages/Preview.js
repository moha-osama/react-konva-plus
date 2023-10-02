import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import Video from "../components/Video";
import { download } from "../utils";

const Preview = ({ shapesUID, videoName, folderUid, totalUploadedImages }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [preview, setPreview] = useState(false);
  const [rectangles, setRectangles] = useState([]);
  const [downloadedImages, setDownloadedImages] = useState([]);
  const [images, setImages] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    setDimensions({
      width: containerWidth,
      height: 600,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await download(
          `S3/mogulvideo/${folderUid}/shapes-${shapesUID}-json`
        );

        const video = await download(`S3/mogulvideo/${folderUid}/${videoName}`);
        setVideo(video);

        const imagePromises = [];
        for (let i = 0; i < totalUploadedImages; i++) {
          const imageUrl = `S3/mogulvideo/${folderUid}/images/image-${i}`;
          imagePromises.push(download(imageUrl));
        }

        const downloadedImages = await Promise.all(imagePromises);
        setDownloadedImages(downloadedImages);

        const processedImages = await Promise.all(
          downloadedImages.map(async (item) => {
            try {
              const response = await fetch(item);
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch image: ${response.statusText}`
                );
              }
              const blob = await response.blob();

              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const img = new window.Image();
                  img.src = e.target.result;
                  img.onload = () => {
                    const aspectRatio = img.width / img.height;
                    const newWidth = 200;
                    const newHeight = newWidth / aspectRatio;
                    img.width = newWidth;
                    img.height = newHeight;
                    resolve(img);
                  };
                };
                reader.readAsDataURL(blob);
              });
            } catch (error) {
              console.error("Error fetching or processing image:", error);
              return null;
            }
          })
        );

        const validImages = processedImages.filter((img) => img !== null);
        setImages((prevImages) => [...validImages, ...prevImages]);

        const response = await fetch(jsonData);
        const jsonDataText = await response.text();
        const parsedData = JSON.parse(jsonDataText);
        setRectangles(parsedData.rectangles);
        setTextElements(parsedData.textElements);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function immediately
  }, []);

  return (
    <div
      className="preview"
      ref={containerRef}
      onClick={() => setPreview(true)}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        className="canvas"
      >
        <Video
          src={video}
          className="video-player"
          containerRef={containerRef}
        />
        {preview && (
          <>
            <Layer>
              {rectangles.map((rect, index) => (
                <Rect
                  key={index}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={rect.fill}
                />
              ))}
            </Layer>
            <Layer>
              {images.map((img, index) => (
                <Image
                  key={index}
                  image={img}
                  x={index * 50}
                  y={0}
                  draggable
                  onDragEnd={(e) => {
                    // Handle the end of dragging here if needed
                  }}
                />
              ))}
            </Layer>
            <Layer>
              {textElements.map((item, index) => (
                <Text
                  key={item.text}
                  text={item.text}
                  x={item.x}
                  y={item.y}
                  fontSize={20}
                  fill="white"
                />
              ))}
            </Layer>
          </>
        )}
      </Stage>
    </div>
  );
};

export default Preview;
