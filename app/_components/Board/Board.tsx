import Files from "./Files";
import Pieces from "../Pieces/Pieces";
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
    .map((x, i) => i + 1);
  return (
    <div className="relative flex items-center justify-center p-8">
      <div className="grid h-[var(--board-size)] relative w-[var(--board-size)] grid-cols-8 grid-rows-8">
        <Ranks ranks={ranks} />
        <>
          {ranks.map((rank, i) =>
            files.map((file, j) => (
              <div
                key={file + "-" + rank}
                draggable={false}
                className={getClassName(7 - i, j)}
              />
            ))
          )}
        </>
        <Pieces />
        <Files files={files} />
      </div>
    </div>
  );
}

export default Board;
