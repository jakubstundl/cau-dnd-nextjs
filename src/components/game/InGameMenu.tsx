import styles from '../../styles/InGameMenu.module.css';

const InGameMenu = ({setVisibility}:{setVisibility:(arg:string)=>void}) => {
  const logOut = () => {
    localStorage.clear();
    window.location.href = '/character-list';
  };
  const displayQuestList = ()=>{
    setVisibility('quest-list')
  }
  return (
    <div className={styles.container}>
      <button className='font-LOTR' title="Character Details" onClick={()=>setVisibility('character-detail')}>C</button>
      <button className='font-LOTR' title="Quest List" onClick={displayQuestList}>Q</button>
      <button className='font-LOTR text-red-900 font-bold' title="Logout" onClick={logOut}>x</button>
    </div>
  );
};

export default InGameMenu;
