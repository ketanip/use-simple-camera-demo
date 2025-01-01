"use client";

import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import { FaCameraRetro, FaDownload } from "react-icons/fa";
import { Separator } from "../ui/separator";
import { CiImageOn } from "react-icons/ci";
import { toast } from "react-toastify";
import { HookContext } from "../contexts/UseSimpleStateContext";
import { sendGAEvent } from "@next/third-parties/google";

const CaptureImage = () => {
  // Getting access to the use-simple-camera hook.
  const context = useContext(HookContext);
  if (!context) return <></>;
  const { hook, videoID } = context;

  const [activeImage, setActiveImage] = useState(0);

  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const captureAndStoreImage = async () => {
    try {
      const capturedImage = await hook.captureImage(videoID);
      setCapturedImages([...capturedImages, capturedImage]);
      setActiveImage(capturedImages.length - 1);
      sendGAEvent("event", "image-captured");
    } catch (error: any) {
      toast(error.message);
    }
  };

  const downloadVisibleImage = () => {
    const imageDownloadElement = document.createElement("a");
    imageDownloadElement.href = capturedImages[activeImage + 1];
    imageDownloadElement.download =
      "use-simple-camera" + new Date().toISOString();
    imageDownloadElement.click();
    imageDownloadElement.remove();
    sendGAEvent("event", "image-downloaded");
  };

  return (
    <div className="grid md:grid-cols-4 gap-4 min-h-[85vh] bg-white my-auto border rounded-lg px-2 md:px-8 py-8 min-w-full">
      <div className="col-span-3 md:border-r border-gray-300 min-h-max md:pl-4 flex ">
        {capturedImages.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImages[activeImage + 1]}
            alt="Captured image."
            className="mx-auto my-auto rounded shadow"
          />
        ) : (
          <div className="mx-auto my-auto">
            <CiImageOn className="text-4xl mx-auto mb-2" />
            <span className="font-medium">No Image Captured Yet.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-[90vw] md:w-auto md:pl-4">
        {/* Main Components. */}
        <h4 className="text-2xl font-semibold">Capture Image</h4>
        <p>
          We will be using{" "}
          <span className="font-mono bg-gray-50 p-0.5">Capture</span> function
          of <span className="font-mono bg-gray-50 p-0.5">Capture</span>{" "}
          function .
        </p>
        <Button
          className="bg-green-500 hover:bg-green-400 text-white"
          onClick={captureAndStoreImage}
        >
          <FaCameraRetro />
          Capture Image
        </Button>

        {capturedImages.length > 0 && (
          <Button variant="secondary" onClick={downloadVisibleImage}>
            <FaDownload />
            Download this Image
          </Button>
        )}

        {/* Captured Images */}
        <Separator />

        <h6 className="font-semibold">Captured Images</h6>
        <div className="grid grid-cols-4 gap-2">
          {capturedImages.length > 0 ? (
            [...Array(capturedImages.length).keys()]
              .map((i) => i + 1)
              .map((item) => (
                <Button
                  variant="secondary"
                  onClick={() => setActiveImage(item - 2)}
                  className={
                    activeImage === item - 2
                      ? "bg-green-500 hover:bg-green-400 text-white font-semibold"
                      : ""
                  }
                  key={`img-${item - 1}`}
                >
                  {item}
                </Button>
              ))
          ) : (
            <div className="text-nowrap flex gap-1">
              <div>
                <CiImageOn className="text-2xl" />
              </div>
              <span>Capture images to get started.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureImage;
