import React, { useState, useRef, useCallback } from "react";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "../styles/home.css";
import { useDropzone } from "react-dropzone";
import { SketchPicker } from "react-color";
import { Button, Divider } from "antd";
import { Input } from "antd";
import * as htmlToImage from "html-to-image";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
function MemeGenerator() {
  const [image, setImage] = useState<string>("");
  const [angleInDegrees, setangleInDegrees] = useState<number>(0);
  const [isMirrored, setIsMirrored] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);
  const [showCropbt, setshowCropbt] = useState<boolean>(false);
  const [upperText, setUpperText] = useState<string>("");
  const [lowerText, setLowerText] = useState<string>("");
  const [isPickerU, setisPickerU] = useState<boolean>(false);
  const [isPickerL, setisPickerL] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [colorPickerU, setcolorPickerU] = useState<string | undefined>(
    "#00000"
  );
  const [colorPickerL, setcolorPickerL] = useState<string | undefined>(
    "#00000"
  );
  const [upImg, setUpImg] = useState<string | ArrayBuffer | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoads: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.target as HTMLImageElement;
    console.log(
      "onLoad",
      img.naturalWidth,
      img.width,
      img.naturalHeight,
      img.height
    );
    imgRef.current = img;
  };

  const makeClientCrop = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      createCropPreview(imgRef.current, crop, "newFile.jpeg");
    }
  };

  const createCropPreview = async (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d")!;

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;

        if (previewUrl) {
          window.URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(window.URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the accepted image file, e.g., display it.
    const imageFile = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(imageFile);
    console.log(imageUrl); // You can use this URL to display the image.
    setImage(imageUrl);
    // You might want to save the image file for further use.
    // You can use state or any other method to manage the image file.
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleChangeCompleteU = (color: any) => {
    setcolorPickerU(color.hex);
    console.log("color:", color);
  };
  const handleChangeCompleteL = (color: any) => {
    setcolorPickerL(color.hex);
    console.log("color:", color);
  };
  const handleChangePic = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileChange = (e: any) => {
    const imageFile = e.target.files[0];
    const url = URL.createObjectURL(imageFile);
    setImage(url);
  };
  const handleUpperText = (e: any) => {
    console.log("dddd", e.target.value);
    setUpperText(e.target.value);
  };

  const handleLowerText = (e: any) => {
    setLowerText(e.target.value);
  };
  const showPickerU = (e: any) => {
    e.stopPropagation();
    setisPickerU(true);
    console.log("isPickerU:", isPickerU);
  };
  const showPickerL = (e: any) => {
    e.stopPropagation();
    setisPickerL(true);
    console.log("isPickerL:", isPickerL);
  };
  const closePicker = () => {
    setisPickerL(false);
    console.log("close isPickerL:", isPickerL);
    setisPickerU(false);
  };
  const generateMeme = () => {
    let node = document.getElementById("my-node");
    if (node) {
      htmlToImage
        .toPng(node)
        .then(function (dataUrl) {
          var img = new Image();
          img.src = dataUrl;
          console.log("dataUrl:", dataUrl);
          const downloadLink = document.createElement("a");
          downloadLink.href = dataUrl;
          downloadLink.download = "meme.png"; // Set the desired filename

          // Append the link to the document body
          document.body.appendChild(downloadLink);

          // Trigger a click event on the link to initiate the download
          downloadLink.click();

          // Remove the link from the document body
          document.body.removeChild(downloadLink);
        })
        .then()
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
  };
  const handleRoate = () => {
    setangleInDegrees(angleInDegrees + 90);
  };
  const handleMirrorClick = () => {
    setIsMirrored((prev) => !prev);
  };
  const handleCrop = () => {
    setShow(false);
    setshowCropbt(true);
  };
  const handleCropDone = () => {
    setShow(true);
    setImage(previewUrl);
    setshowCropbt(false);
  };
  const handleBack = () => {
    setImage("");
  };
  return (
    <>
      <div className="main-continer">
        <div className="top-bar">
          <i className="fa-solid fa-droplet">
            <span>Meme Generator</span>
          </i>
          <Button
            onClick={handleBack}
            className="back-btn"
            type="primary"
            shape="circle"
            icon={<ArrowLeftOutlined />}
          />
        </div>
        <div className="meme-content">
          {image === "" ? (
            <div className="dropzone" {...getRootProps()}>
              <i
                className="fa-solid fa-plus"
                style={{ fontSize: "7em", color: "#E85545" }}
              ></i>

              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
              <Divider orientation="center" plain>
                OR
              </Divider>
              <Button className="choose-btn" shape="round">
                Choose File
              </Button>
            </div>
          ) : (
            <div className="meme-content">
                {/* uploaded image code start */}
              <div className="meme-img-container">
                <div className="meme-img-inner-container" id="my-node">
                  <h1 style={{ color: colorPickerU }} className="upper-text">
                    {upperText ? upperText : "Upper Text"}
                  </h1>
                  {show ? (
                    <img
                      style={{
                        transform: `rotate(${angleInDegrees}deg)${
                          isMirrored ? " scaleX(-1)" : ""
                        }`,
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                      className="meme-img"
                      src={image}
                      alt=""
                    />
                  ) : (
                    <ReactCrop
                      crop={crop}
                      onChange={(c, percentCrop) => setCrop(percentCrop)}
                      onComplete={makeClientCrop}
                    >
                      <img
                        alt="Crop me"
                        src={image as string}
                        onLoad={onLoads}
                      />
                    </ReactCrop>
                  )}

                  <h1 style={{ color: colorPickerL }} className="lower-text">
                    {lowerText ? lowerText : "Lower Text"}
                  </h1>
                </div>
                {showCropbt && (
                  <Button
                    className="crop-done-btn"
                    shape="round"
                    type="primary"
                    onClick={handleCropDone}
                  >
                    Crop
                  </Button>
                )}
              </div>
                {/* uploaded image code end */}

              {/* Editor code start */}
              <div className="meme-content-design" onClick={closePicker}>
                <div className="editor-top-bar">
                  <h3>Text Editor</h3>
                </div>
                <Divider
                  className="divider"
                  orientation="center"
                  plain
                ></Divider>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={inputRef}
                  onChange={handleFileChange}
                />
                <div className="btn-wrapper">
                <Button
                  className="meme-btn"
                  type="primary"
                  onClick={handleChangePic}
                >
                  Change picture
                </Button>
                <Button
                  onClick={generateMeme}
                  type="primary"
                  className="meme-btn"
                >
                  Generate Meme
                </Button>
                </div>
                <div className="input-container">
                  <div className="input-one-container">
                    <span>Upper Text</span>
                    <div className="input-c">
                      <Input
                        onChange={handleUpperText}
                        className="input-one"
                        size="large"
                        placeholder="large size"
                      />
                      <div
                        style={{ backgroundColor: colorPickerU }}
                        className="picker-container"
                        onClick={showPickerU}
                      >
                        {isPickerU && (
                          <SketchPicker
                            className="color-picker"
                            color={colorPickerU}
                            onChangeComplete={handleChangeCompleteU}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="input-two-container">
                    <span>Lower Text</span>
                    <div className="input-c">
                      <Input
                        onChange={handleLowerText}
                        className="input-two"
                        size="large"
                        placeholder="large size"
                      />
                      <div
                        style={{ backgroundColor: colorPickerL }}
                        className="picker-container"
                        onClick={showPickerL}
                      >
                        {isPickerL && (
                          <SketchPicker
                            className="color-picker"
                            color={colorPickerL}
                            onChangeComplete={handleChangeCompleteL}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rotate-container">
                  <span>Rotate</span>
                  <Button
                    onClick={handleRoate}
                    type="primary"
                    className="rotate-btn"
                  >
                    Rotate
                  </Button>
                </div>
                <div className="rotate-container" style={{ marginTop: "20px" }}>
                  <span>Mirror image</span>
                  <Button
                    onClick={handleMirrorClick}
                    type="primary"
                    className="rotate-btn"
                  >
                    Mirror
                  </Button>
                </div>
                <div className="rotate-container" style={{ marginTop: "20px" }}>
                  <span>Crop</span>
                  <Button
                    onClick={handleCrop}
                    type="primary"
                    className="rotate-btn"
                  >
                    Crop the image
                  </Button>
                </div>

              </div>
              {/* Editor code end */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MemeGenerator;
