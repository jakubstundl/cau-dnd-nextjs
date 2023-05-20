const NPC_Container = (
  props: {
    npc: {
      posY: number;
      posX: number;
      name: string;
      img: string;
      stats: {
        hp: number;
        cur_hp: number;
        dmg: number;
        pwr: number;
        exp: number;
      };
    };
    map: HTMLDivElement;
  },
) => {
  return (
    <div
      id="npc-container"
      style={{
        position: 'absolute',
        top: `${(props.npc.posY * props.map.clientWidth) / 1600}px`,
        left: `${(props.npc.posX * props.map.clientWidth) / 1600}px`,
        width: `${props.map.clientWidth / 20}px`,
        height: `${props.map.clientWidth / 20}px`,
      }}
      key={props.npc.name}
    >
      <div
        style={{
          backgroundImage: `url(${props.npc.img})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%',
        }}
      ></div>
      <div>{props.npc.name}</div>
      <div>HP: {props.npc.stats.cur_hp}</div>
    </div>
  );
};

export default NPC_Container;
