import { useSession } from "next-auth/react";

const Player_Container = (
    props: {
        hero_name: string
        another_props: {
            x: number;
            y: number;
            ownerId: string;
            orientation: number;
            status: {
                battle: boolean;
                alive: boolean;
            };
        },
        map: HTMLDivElement,
        startBattle: () => Promise<void>,
    }
) => {
    const session = useSession()
    return (
        <div
                id='player-container'
                style={{ 
                  position: 'absolute',
                  top: `${props.another_props.y*props.map.clientWidth/1600}px`,
                  left: `${props.another_props.x*props.map.clientWidth/1600}px`,
                  width: `${props.map.clientWidth/50}px`,
                  height: `${props.map.clientWidth/25}px`,
                }}

                key={props.hero_name}
              >
                <div
                  style={{
                    position:"relative",
                    left:`-${12* props.map.clientWidth/1600}px`,
                    top:`-${25* props.map.clientWidth/1600}px`,
                    transform: `scaleX(${props.another_props.orientation>0?"1":"-1"})`,
                    backgroundImage: `url(${Math.abs(props.another_props.orientation)>1?'/npc/rogue.gif':'/npc/rogue.png'})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%',
                  }}
                ></div>
                <div>{props.hero_name}</div>

               {(session.data?.user?.id === props.another_props.ownerId && props.another_props.status.battle) && 
                  <button
                    disabled={false}
                    onClick={props.startBattle}
                    style={{
                      position:"absolute",
                      left:`-${12* props.map.clientWidth/1600 + props.map.clientWidth/50}px`,
                      top:`-${25* props.map.clientWidth/1600 + props.map.clientWidth/25}px`,
                      zIndex: "100",
                      fontFamily: 'LOTR',
                      color: 'goldenrod',
                      border: 'solid red 1px',
                      borderRadius: '5px',
                      backgroundColor: 'black',
                      height: '40px',
                      width: '120px',
                      boxShadow: '2px 2px  2px 2px black',
                    }}
                  >
                    Start Battle
                  </button>
                }
              </div>
    )
}

export default Player_Container;
