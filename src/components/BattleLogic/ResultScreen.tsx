const ResultScreen = ({
  handleClick,
  whosIsDead,
}: {
  handleClick: () => void;
  whosIsDead: string;
}) => {
  return (
    <>
      {whosIsDead === 'hero' && (
        <div
          onClick={handleClick}
          className="absolute inset-1/4 h-1/2 w-1/2 bg-contain bg-no-repeat"
          style={{ backgroundImage: 'url(/defeat.png)' }}
        >
          You lose
        </div>
      )}
      {whosIsDead === 'enemy' && (
        <div
          onClick={handleClick}
          className="absolute inset-1/4 h-1/2 w-1/2 bg-contain bg-no-repeat"
          style={{ backgroundImage: 'url(/victory.jpg)' }}
        >
          You win
        </div>
      )}
    </>
  );
};

export default ResultScreen;
