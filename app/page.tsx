import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { FaCameraRetro, FaVideo } from "react-icons/fa";
import { IoAlertCircleSharp } from "react-icons/io5";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
        <div>
          <IoAlertCircleSharp className="text-2xl text-red-600" />
        </div>
        <span>
          This demo uses your camera and audio devices so{" "}
          <b>please allow the required permissions</b> for smooth experience. No
          data is uploaded to server.
        </span>
      </div>

      <div className="bg-white p-4 rounded-lg border flex items-center gap-3">
        <div>
          <IoAlertCircleSharp className="text-2xl text-orange-400" />
        </div>
        <span>
          This demo is optimized for desktop, so{" "}
          <b>use desktop for smoother experience</b>.
        </span>
      </div>

      <div className="mt-4">
        <h2 className="text-2xl font-semibold">Demos</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {/* Image Capturing */}
          <div className="border rounded-lg p-4 flex flex-col bg-white gap-3 py-6 shadow-md">
            <h2 className="text-2xl text-center font-semibold">
              Image Capturing
            </h2>

            <div className="min-h-[25vh] flex p-4 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500  rounded ">
              <FaCameraRetro className="text-7xl mx-auto my-auto rounded-xl text-white" />
            </div>

            <span className="font-semibold">Features:</span>
            <ol>
              <li>1. Capture Image</li>
              <li>2. Download Image</li>
              <li>3. View Image</li>
            </ol>

            <Link href="/capture-image">
              <Button className="border min-w-full">
                View Demo <ChevronRight />
              </Button>
            </Link>
          </div>

          {/* Video Capturing */}
          <div className="border rounded-lg p-4 flex flex-col bg-white gap-3 py-6 shadow-md">
            <h2 className="text-2xl text-center font-semibold">
              Video Recoding
            </h2>

            <div className="min-h-[25vh] flex p-4 bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-500  rounded ">
              <FaVideo className="text-7xl mx-auto my-auto rounded-xl text-white" />
            </div>

            <span className="font-semibold">Features:</span>
            <ol className="">
              <li>1. See video and Audio Feed</li>
              <li>2. Record Video</li>
              <li>3. Download Recorded Videos</li>
              <li>4. Play Recorded Videos</li>
            </ol>

            <Link href="/record-video">
              <Button className="border min-w-full">
                View Demo <ChevronRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
