import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {shuffle} from 'lodash';
import RandomNumber from './RandomNumber';

type gameStatusType = 'Won' | 'Lost' | 'Playing';

const GameIndex: React.FC<
  PropsWithChildren<{
    randomNumberCount?: number;
    gameTime?: number;
    resetGame: Function;
  }>
> = ({randomNumberCount = 6, gameTime = 10, resetGame}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState<number>(gameTime);
  const [gameStatus, setGameStatus] = useState<gameStatusType>('Playing');

  const randomNumbers = useMemo(
    () =>
      Array.from({length: randomNumberCount}).map(
        () => 1 + Math.floor(10 * Math.random()),
      ),
    [randomNumberCount],
  );

  const target: number = randomNumbers
    .slice(0, randomNumberCount - 2)
    .reduce((inc, current) => current + inc, 0);

  const shuffledNumbers = useMemo(
    () => shuffle(randomNumbers),
    [randomNumbers],
  );

  const calcGameStatus = useCallback(
    (updatedIds: number[] = selectedIds) => {
      const sumSelected = updatedIds.reduce(
        (acc, curr) => acc + shuffledNumbers[curr],
        0,
      );

      if (sumSelected > target) {
        setGameStatus('Lost');
      }
      if (sumSelected < target) {
        setGameStatus('Playing');
      }
      if (sumSelected === target) {
        setGameStatus('Won');
      }
    },
    [shuffledNumbers, target, selectedIds],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev === 1) {
          setGameStatus('Lost');
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    if (gameStatus !== 'Playing') {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [gameTime, gameStatus, calcGameStatus]);

  const isNumberSelected = (numberIndex: number) => {
    return selectedIds.indexOf(numberIndex) >= 0;
  };

  const selectNumber = (numberIndex: number) => {
    setSelectedIds(prev => {
      calcGameStatus([...prev, numberIndex]);
      return [...prev, numberIndex];
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.target, styles[`Status${gameStatus}`]]}>
        {target}
      </Text>
      <View style={styles.randomContainer}>
        {shuffledNumbers.map((item: number, index: number) => {
          return (
            <RandomNumber
              number={item}
              key={index}
              id={index}
              isDisabled={isNumberSelected(index) || gameStatus !== 'Playing'}
              onPress={selectNumber}
            />
          );
        })}
      </View>
      <Text style={styles.target}>{gameStatus}</Text>
      <Text style={styles.target}>Time Remaining {remainingTime} Seconds</Text>
      <Button title="Play Again" onPress={() => resetGame()} />
    </View>
  );
};

export default GameIndex;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 40,
    padding: 24,
    backgroundColor: 'orange',
    flex: 1,
  },
  target: {
    fontSize: 40,
    textAlign: 'center',
    marginHorizontal: 50,
    marginVertical: 30,
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  StatusPlaying: {
    backgroundColor: '#ddd',
  },
  StatusLost: {
    backgroundColor: 'red',
  },
  StatusWon: {
    backgroundColor: 'green',
  },
});
