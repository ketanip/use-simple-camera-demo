"use client";

import React, { useContext } from "react";
import { Button } from "../ui/button";
import { FaGithub, FaNpm } from "react-icons/fa";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { HookContext } from "../contexts/UseSimpleStateContext";

const Navbar = () => {
  // Getting access to the use-simple-camera hook.
  const context = useContext(HookContext);
  if (!context) return <></>;
  const { hook } = context;

  const toggleCamera = () => {
    if (hook.isCameraActive) hook.stopCamera();
    else hook.startCamera();
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-4 md:flex-row justify-between items-center">
        <Link href="/">
          <div className="bg-yellow-400 font-mono font-semibold shadow-black px-4 py-2 text-nowrap">
            use-simple-camera
          </div>
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            href="https://github.com/ketanip/use-simple-camera"
            target="_new"
          >
            <FaGithub className="text-3xl" />
          </Link>
          <Link
            href="https://www.npmjs.com/package/use-simple-camera"
            target="_new"
          >
            <FaNpm className="text-4xl" />
          </Link>

          <Button
            className="bg-white hover:bg-gray-100 text-gray-800 border rounded-full"
            onClick={toggleCamera}
          >
            {!hook.isCameraActive ? (
              <div className="flex gap-2 items-center">
                <FaVideo className="text-green-500 text-4xl" />
                <span>Start Camera</span>
              </div>
            ) : (
              <>
                <FaVideoSlash className="text-red-500  text-4xl" />
                <span>Stop Camera</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
