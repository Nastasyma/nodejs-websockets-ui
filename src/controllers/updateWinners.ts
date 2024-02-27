import { db } from '../db';
import { updateWinnersResponse } from '../utils/response';

export const addWinnerByName = (name: string) => {
  const { winners, findWinner, addWinner } = db;
  const wIndex = findWinner(name);
  if (wIndex !== -1) {
    winners[wIndex].wins++;
  } else {
    const newWinner = { name, wins: 1 };
    addWinner(newWinner);
  }
  updateWinners();
};
export const updateWinners = () => {
  const { sockets, winners } = db;

  Object.keys(sockets).forEach((key) => sockets[key].send(updateWinnersResponse(winners)));
};
