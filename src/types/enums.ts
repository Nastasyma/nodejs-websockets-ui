export enum MESSAGE_TYPES {
  REGISTRATION = 'reg',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  CREATE_GAME = 'create_game',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  UPDATE_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  RANDOM_ATTACK = 'randomAttack',
  TURN = 'turn',
  ATTACK = 'attack',
  FINISH = 'finish',
  SINGLE_PLAY = 'single_play',
}

export enum ATTACK_STATUS {
  MISS = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
}

export enum TILE_STATUS {
  SHIP = 'ship',
  DAMAGED = 'damaged',
  EMPTY = 'empty',
}
