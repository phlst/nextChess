import Files from "./Files";
import Ranks from "./Ranks";

function getClassName(i: number, j: number) {
  let c = "tile ";
  c += (i + j) % 2 === 0 ? " bg-dark-tile " : " bg-light-tile ";
  return c;
}

function Board() {
  const ranks = Array(8)
    .fill("")
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill("")
    .map((x, i) => i + i);
  return (
    <div className="grid h-[var(--board-size)] w-[var(--board-size)] grid-cols-8 grid-rows-8">
      <div className="grid h-full top-0  w-full grid-cols-8 grid-rows-8">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div key={file + "-" + rank} className={getClassName(7 - i, j)} />
          ))
        )}
      </div>
      <Files files={files} />
      <Ranks ranks={ranks} />
    </div>
  );
}

export default Board;
