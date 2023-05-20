import { Entity } from './entity';
import { NPC } from './npc';

export class Player extends Entity {
  opponent: NPC | undefined;
  private _speed = 5;
  public orientation: number;
  private _move: { up: boolean; left: boolean; right: boolean; down: boolean } =
    { up: false, left: false, right: false, down: false };

  constructor(
    _name: string,
    _x: number,
    _y: number,
    _hp: number,
    _cur_hp: number,
    public str: number,
    public dex: number,
    public con: number,
    public int: number,
    public wis: number,
    public char: number,
    public clas: string,
    public race: string,
  ) {
    super(_name, _x, _y, _hp, _cur_hp);
    this.orientation = 1;
    this.opponent = undefined;
  }

  get getStats() {
    return {
      str: this.str,
      dex: this.dex,
      con: this.con,
      int: this.int,
      wis: this.wis,
      char: this.char,
    };
  }

  get details() {
    return { clas: this.clas, race: this.race };
  }

  play(
    up: boolean,
    left: boolean,
    right: boolean,
    down: boolean,
    orientation: number,
  ) {
    this._move = { up: up, left: left, right: right, down: down };
    this.orientation = orientation;
  }

  private _moving(size: { x: number; y: number }) {
    if (
      //up
      this._move.up &&
      !this._move.left &&
      !this._move.right &&
      !this._move.down
    ) {
      this._y = this._y - this._speed;
    } else {
      if (
        //left
        !this._move.up &&
        this._move.left &&
        !this._move.right &&
        !this._move.down
      ) {
        this._x = this._x - this._speed;
      } else {
        if (
          //right
          !this._move.up &&
          !this._move.left &&
          this._move.right &&
          !this._move.down
        ) {
          this._x = this._x + this._speed;
        } else {
          if (
            !this._move.up &&
            !this._move.left &&
            !this._move.right &&
            this._move.down
          ) {
            this._y = this._y + this._speed;
          } else {
            if (
              this._move.up &&
              this._move.left &&
              !this._move.right &&
              !this._move.down
            ) {
              this._y = this._y - this._speed / Math.sqrt(2);
              this._x = this._x - this._speed / Math.sqrt(2);
            } else {
              if (
                this._move.up &&
                !this._move.left &&
                this._move.right &&
                !this._move.down
              ) {
                this._y = this._y - this._speed / Math.sqrt(2);
                this._x = this._x + this._speed / Math.sqrt(2);
              } else {
                if (
                  !this._move.up &&
                  this._move.left &&
                  !this._move.right &&
                  this._move.down
                ) {
                  this._y = this._y + this._speed / Math.sqrt(2);
                  this._x = this._x - this._speed / Math.sqrt(2);
                } else {
                  if (
                    !this._move.up &&
                    !this._move.left &&
                    this._move.right &&
                    this._move.down
                  ) {
                    this._y = this._y + this._speed / Math.sqrt(2);
                    this._x = this._x + this._speed / Math.sqrt(2);
                  } else {
                  }
                }
              }
            }
          }
        }
      }
    }
    if (this._x < 0) {
      this._x = 0;
    }
    if (this._x > size.x) {
      this._x = size.x;
    }
    if (this._y < 0) {
      this._y = 0;
    }
    if (this._y > size.y) {
      this._y = size.y;
    }
  }
  move = this._moving;

  getInBattle(): void {
    this.move = () => {
      return;
    };
  }

  getOutBattle() {
    this.move = this._moving;
    this.opponent = undefined;
    this.setStatus = { battle: false };
  }

  findOpponent(opponent: NPC): void {
    if (
      opponent.status.alive &&
      !opponent.status.battle &&
      this._status.alive &&
      !this._status.battle
    ) {
      this.setStatus = { battle: true };
      opponent.setStatus = { battle: true };
      this.opponent = opponent;
      this.getInBattle();
    }
  }

  changeHp(new_cur_hp: number) {
    this._cur_hp = new_cur_hp;
  }
}
