function Files({ files }: { files: number[] }) {
  return (
    <div className="">
      {files.map((file, index) => (
        <span key={index}></span>
      ))}
    </div>
  );
}

export default Files;
