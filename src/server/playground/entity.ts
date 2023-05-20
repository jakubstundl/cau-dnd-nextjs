export abstract class Entity {
  protected _status: { battle: boolean, alive: boolean }  = { battle: false, alive: true };

  constructor(
    protected _name: string,
    protected _x: number,
    protected _y: number,
    protected _hp: number,
    protected _cur_hp: number,
  ) {}

  get name() {
    return this._name;
  }

  get coords() {
    return { x: this._x, y: this._y };
  }

  get status() {
    return { battle: this._status.battle, alive: this._status.alive };
  }
  
  set setStatus({ alive, battle }: { alive?: boolean; battle?: boolean }) {
    if (alive!==undefined) {
      this._status = { ...this._status, alive: alive };
    }
    if (battle!==undefined) {
      this._status = { ...this._status, battle: battle };
    }
  }

  get hp() {
    return this._hp;
  }

  get currentHP() {
    return this._cur_hp;
  }
}
