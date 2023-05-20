import { randomUUID } from 'crypto';
import { Entity } from './entity';
import { Player } from './player';

export class NPC extends Entity {
  public id: string = randomUUID();
  public inBattle = false;
  constructor(
    _name: string,
    _x: number,
    _y: number,
    _hp: number,
    _cur_hp: number,
    protected dmg: number,
    protected pwr: number,
    protected img: string,
    protected exp: number,
  ) {
    super(_name, _x, _y, _hp, _cur_hp);
  }

  get getStats() {
    return {
      hp: this._hp,
      cur_hp: this._cur_hp,
      dmg: this.dmg,
      pwr: this.pwr,
      exp: this.exp,
    };
  }

  get image() {
    return this.img;
  }

  getNearbies(players: Map<string, Player>) {
    const playerArr = Array.from(players.values());
    const nearbyPlayers = playerArr.filter((player) => {
      return (
        this.calcDist(this._x, this._y, player.coords.x, player.coords.y) < 20
      );
    });
    if (!this.inBattle && nearbyPlayers.length > 0) {
      this.inBattle = true;
      nearbyPlayers[0].findOpponent(this);
    }
  }

  calcDist(x1: number, y1: number, x2: number, y2: number) {
    const distX = Math.abs(x1 - x2);
    const distY = Math.abs(y1 - y2);
    const result = Math.sqrt(distX ** 2 + distY ** 2);
    return result;
  }

  surviveBattle() {
    setTimeout(() => {
      this.setStatus = { battle: false };
      this.inBattle = false;
    }, 1000);
  }
}
