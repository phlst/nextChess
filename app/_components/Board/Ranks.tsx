function Ranks({ ranks }: { ranks: number[] }) {
  return (
    <div className="">
      {ranks.map((ranks, index) => (
        <span key={index}></span>
      ))}
    </div>
  );
}

export default Ranks;
