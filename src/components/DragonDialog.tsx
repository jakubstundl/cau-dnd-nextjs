import { useState } from 'react';
import styles from '../styles/DragonDialog.module.css';
import Image from 'next/image';
import { Characters } from '@prisma/client';
import { trpc } from 'utils/trpc';

const DragonDialog = ({hero,setVisible}:{hero:Characters,setVisible:(x:string)=>void}) => {
  const [dialogOption, setDialogOption] = useState<number>(1);
  const acceptingQ = trpc.dbRouter.acceptQuest.useMutation()
  const nextDialog = () => {
    const page = dialogOption + 1;
    setDialogOption(page);
  };
  const heroName = hero.name || 'Player'
  const fight = () => {
    setVisible('nada')
  };
  const leave = () => {
    setVisible('nada')
  };
  const acceptQuest = ()=>{
    acceptingQ.mutate({questId:2,heroName:hero.name})
}
  return (
    <div className={styles.main}>
      <Image src='/wallpers/dragon-dialog.jpg' alt='' width={2000} height={2000} className={styles.background}/> 
      <Image src='/wallpers/goldborder.png' alt='' width={2000} height={2000} className={styles.frame}/> 
      <div className={styles.container}>
        {dialogOption === 1 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">
              Greetings, mortal. I am the mighty dragon who rules these lands.
              Who dares to enter my territory?
            </p>
            <br />
            <p className="gold font-LOTR">{heroName} :</p>
            <button className={styles.dialogButton} onClick={nextDialog}>
              <span className="gold font-LOTR">
                I am a brave hero here to defeat you and save the kingdom.
              </span>
            </button>
          </div>
        )}
        {dialogOption === 2 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">
              Ha! You think you can defeat me? I am the strongest creature in
              the land.
            </p>
            <br />
            <p className="gold font-LOTR">{heroName} :</p>
            <button
              className={styles.dialogButton}
              onClick={() => setDialogOption(7)}
            >
              <span className="gold font-LOTR">
                I am not afraid of you. Let us fight.
              </span>
            </button>
            <button className={styles.dialogButton} onClick={nextDialog}>
              <span className="gold font-LOTR">
                I do not wish to fight you. Can we come to a peaceful
                resolution?
              </span>
            </button>
          </div>
        )}
        {dialogOption === 3 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">
              Hmph. You have some sense, I see. What is it you propose?
            </p>
            <br />
            <p className="gold font-LOTR">{heroName}</p>
            <button className={styles.dialogButton} onClick={nextDialog}>
              <span className="gold font-LOTR">
                I propose that we work together to defeat a greater threat that
                threatens both our lands.
              </span>
            </button>
          </div>
        )}
        {dialogOption === 4 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">
              And what makes you think I would ever work with a puny mortal like
              yourself?
            </p>
            <br />
            <p className="gold font-LOTR">{heroName}</p>
            <button className={styles.dialogButton} onClick={nextDialog}>
              <span className="gold font-LOTR">
                I have information and resources that can help us in this quest.
                And I believe that together we stand a better chance of success
                than alone.
              </span>
            </button>
          </div>
        )}
        {dialogOption === 5 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">
              Hmmm, interesting proposal. I will consider it. But make no
              mistake, mortal. I will not hesitate to destroy you if you betray
              me or prove to be weak in battle.
            </p>
            <br />
            <p className="gold font-LOTR">{heroName}</p>
            <button className={styles.dialogButton} onClick={()=>{nextDialog(),acceptQuest()}}>
              <span className="gold font-LOTR">
                I understand and will not disappoint you. Together we will be
                victorious.
              </span>
            </button>
          </div>
        )}
        {dialogOption === 6 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">
              {`Very well. Let's see what you are capable of. Let's go.`}
            </p>
            <br />
            <button className={styles.dialogButton} onClick={leave}>
              <span className="gold font-LOTR">Leave</span>
            </button>
          </div>
        )}
        {dialogOption === 7 && (
          <div className={styles.dialogOption}>
            <p className="gold font-LOTR">Dragon :</p>
            <br />
            <p className="gold font-LOTR">{`Very well, mortal. Prepare to meet your demise.`}</p>
            <br />
            <button className={styles.dialogButton} onClick={fight}>
              <span className="gold font-LOTR">Fight</span>
            </button>
          </div>
        )}
      </div>
      
       
    
    </div>
  );
};

export default DragonDialog;
