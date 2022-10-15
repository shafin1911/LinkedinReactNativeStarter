import React, {useState} from 'react';
import GameIndex from './src/components/GameIndex';

const App = () => {
  const [gameId, setGameId] = useState<string>('a1');
  const resetGame = () => {
    setGameId(prev => prev + 1);
  };
  return (
    <GameIndex
      key={gameId}
      randomNumberCount={6}
      gameTime={15}
      resetGame={resetGame}
    />
  );
};

export default App;
