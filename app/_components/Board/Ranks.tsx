function Ranks({ ranks }: { ranks: number[] }) {
  return (
    <div className="absolute grid grid-rows-8 h-full left-0 transform -translate-x-6 pointer-events-none">
      {ranks.map((rank, index) => (
        <span key={index} className="flex items-center justify-center">
          {rank}
        </span>
      ))}
    </div>
  );
}

export default Ranks;
