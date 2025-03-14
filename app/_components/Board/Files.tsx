import { getCharCode } from "@/app/helper";

function Files({ files }: { files: number[] }) {
  return (
    <div className="absolute grid grid-cols-8 w-full bottom-0 transform translate-y-6 pointer-events-none">
      {files.map((file, index) => (
        <span key={index} className="flex items-center justify-center">
          {getCharCode(file)}
        </span>
      ))}
    </div>
  );
}

export default Files;
