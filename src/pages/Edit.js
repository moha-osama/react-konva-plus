import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Rect, Text, Image } from "react-konva";
import { useNavigate } from "react-router";
import Video from "../components/Video";
import { upload } from "../utils/index";
import { useDropzone } from "react-dropzone";

const Edit = ({
  fileName,
  uploadedFile,
  setShapesUID,
  setVideoName,
  setFolderUid,
  setTotalUploadedImages,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef();

  const [tool, setTool] = useState("rect");

  const [videoURL, setVideoURL] = useState(null);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [rectangles, setRectangles] = useState([]);

  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });

  const handleDragEnd = (e, index) => {
    const newRectangles = [...rectangles];
    newRectangles[index] = {
      ...newRectangles[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setRectangles(newRectangles);
  };

  // set dimensions
  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;

    setDimensions({
      width: containerWidth,
      height: 600,
    });
  }, []);

  //

  // Adding Image
  const [uploadedImages, setUploadedImages] = useState([]);
  const [images, setImages] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedImage = acceptedFiles[0];
        setUploadedImages((prevImages) => [selectedImage, ...prevImages]);
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
            const newImages = [...images];
            newImages.push(img);
            setImages(newImages);
          };
        };
        reader.readAsDataURL(selectedImage);
      }
    },
    [images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // actions
  const handleMouseDown = (e) => {
    if (tool === "rect") {
      setDrawing(true);
      const stage = e.target.getStage();
      setStartPos(stage.getPointerPosition());
      setEndPos(stage.getPointerPosition());
    }
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const stage = e.target.getStage();
    setEndPos(stage.getPointerPosition());
  };
  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);
    const newRectangle = {
      x: Math.min(startPos.x, endPos.x),
      y: Math.min(startPos.y, endPos.y),
      width: Math.abs(endPos.x - startPos.x),
      height: Math.abs(endPos.y - startPos.y),
      fill: "blue", // Rectangle fill color
    };
    setRectangles([...rectangles, newRectangle]);
  };

  //For Text Elements
  const [textElements, setTextElements] = useState([]);
  const [text, setText] = useState("");
  const [position, setPosition] = useState({ x: 100, y: 100 });

  //add new texts
  const textSubmitHandler = (e) => {
    e.preventDefault();
    const newRectangle = {
      x: position.x,
      y: position.y,
      text: text,
    };
    setTextElements([...textElements, newRectangle]);
    setText("");
  };

  const handleTextDrag = (e, index) => {
    const newTextElements = [...textElements];
    newTextElements[index] = {
      ...newTextElements[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setTextElements(newTextElements);
  };

  //save  to json file
  const saveShapesHandler = () => {
    const objects = { rectangles, textElements };

    const { videoFileName, shapesUid, folderUid, totalUploadedImages } = upload(
      fileName,
      objects,
      uploadedImages
    );
    setShapesUID(shapesUid);
    setVideoName(videoFileName);
    setFolderUid(folderUid);
    setTotalUploadedImages(totalUploadedImages);
  };

  //getting video for preview
  React.useEffect(() => {
    if (fileName) {
      const videoBlob = new Blob([fileName]);
      const videoObjectURL = URL.createObjectURL(videoBlob);
      setVideoURL(videoObjectURL);
    }
  }, [fileName]);

  return (
    <div className="App">
      <div className="global-container">
        <div className="canvas-container" ref={containerRef}>
          <Stage
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            width={dimensions.width}
            height={dimensions.height}
            className="canvas"
          >
            <Video src={videoURL} containerRef={containerRef} />
            <Layer>
              {rectangles.map((rect, index) => (
                <Rect
                  key={index}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={rect.fill}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, index)}
                />
              ))}
            </Layer>
            <Layer>
              {drawing && (
                <Rect
                  x={Math.min(startPos.x, endPos.x)}
                  y={Math.min(startPos.y, endPos.y)}
                  width={Math.abs(endPos.x - startPos.x)}
                  height={Math.abs(endPos.y - startPos.y)}
                  stroke="blue"
                />
              )}
            </Layer>
            <Layer>
              {images.map((img, index) => (
                <Image
                  key={index}
                  image={img}
                  x={index * 50} // Adjust the x-coordinate for spacing
                  y={0} // Adjust the y-coordinate as needed
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
                  draggable
                  x={item.x}
                  y={item.y}
                  fontSize={20}
                  onDragEnd={(e) => handleTextDrag(e, index)}
                  fill="white"
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
      <div>
        <button onClick={() => setTool("rect")}>Rectangle</button>
        {/*adding image*/}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <button onClick={() => setTool("img")}>Image</button>
          )}
        </div>
        <button onClick={saveShapesHandler}>Save</button>
        <button onClick={() => navigate("/preview")}>Preview</button>
      </div>
      <form onSubmit={textSubmitHandler}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Edit;
