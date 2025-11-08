import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="w-full">
          <Navbar />
      </div>
      <div className="flex-1 p-2 overflow-auto">
        <Editor />
      </div>
    </div>
  );
}
