'use client'

import { useEffect, useRef, useState } from "react"
import { ACTION_LIST, STAGE_NUMBER } from "../../setting"
import { Character } from "@/model/character";
import { ACTION_TYPE } from "@/constants/type";
import Image from "next/image";
import { BattleStage } from "@/model/stage";
import { BATTLE_PROGRESS_TIME, BATTLE_WAIT_TIME } from "@/constants/appParameter";
import { PLAYER01 } from "../../player01";
import { PLAYER02 } from "../../player02";

export default function Home() {

    const [player, setPlayer] = useState<Character>();
    const [enemy, setEnemy] = useState<Character>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [turnCount, setTurnCount] = useState<number>(0);
    const [battleLog, setBattleLog] = useState<string[]>(["ーーーーーバトルスタート！ーーーーー"]);
    const [stage, setStage] = useState<BattleStage>();
    
    const logContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * 処理を指定秒数（ミリ秒）待機
     * @param ms 待機ミリ秒数
     */
    const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

    /**
     * 初回マウント時の1回のみ発火するuseEffect
     */
    useEffect(() => {
        let initPlayer;
        let initEnemy;
        let initStage;
        switch(STAGE_NUMBER) {
            case 0:
                initPlayer = new Character(PLAYER01.name, PLAYER01.hp, PLAYER01.mp, PLAYER01.str, PLAYER01.def, PLAYER01.speed, PLAYER01.actions, PLAYER01.image, true);
                initEnemy = new Character("5歳児", 0, 0, 0, 0, 0, PLAYER02.actions, PLAYER02.image, true);
                initStage = new BattleStage("闘技場", "battle-back.svg");
                break;
            case 1:
                initPlayer = new Character("あなた", 50, 40, 10, 4, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("スーパースライム", 30, 0, 10, 5, 5, [ACTION_TYPE.ATTACK], "enemy1.svg", false);
                initStage = new BattleStage("ステージ1：始まりの平原", "back01.svg");
                break;
            case 2:
                initPlayer = new Character("あなた", 50, 40, 10, 4, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("スーパーゴブリン", 40, 30, 15, 6, 5, [ACTION_TYPE.ATTACK,ACTION_TYPE.ATTACK,ACTION_TYPE.DOUBLE_ATTACK], "enemy2.svg", false);
                initStage = new BattleStage("ステージ1：始まりの平原", "back01.svg");
                break;
            case 3:
                initPlayer = new Character("あなた", 70, 50, 15, 8, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("ポイズンバット", 50, 50, 15, 5, 15, [ACTION_TYPE.POISON,ACTION_TYPE.SKILL,ACTION_TYPE.ATTACK], "enemy3.svg", false);
                initStage = new BattleStage("ステージ2：魔獣の森", "back02.svg");
                break;
            case 4:
                initPlayer = new Character("あなた", 70, 50, 15, 8, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("デカニワトリ", 80, 60, 20, 4, 10, [ACTION_TYPE.SKILL,ACTION_TYPE.WAIT,ACTION_TYPE.ATTACK,ACTION_TYPE.ATTACK], "enemy4.svg", false);
                initStage = new BattleStage("ステージ2：魔獣の森", "back02.svg");
                break;
            case 5:
                initPlayer = new Character("あなた", 80, 60, 20, 10, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("デーモン", 90, 100, 20, 10, 15, [ACTION_TYPE.ATTACK,ACTION_TYPE.HEAL,ACTION_TYPE.SKILL,ACTION_TYPE.POISON], "enemy5.svg", false);
                initStage = new BattleStage("ステージ3：試練の砂漠", "back03.svg");
                break;
            case 6:
                initPlayer = new Character("あなた", 30, 80, 5, 2, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("ゴーレム", 50, 45, 10, 4, 10, [ACTION_TYPE.WAIT,ACTION_TYPE.GUARD,ACTION_TYPE.SKILL,ACTION_TYPE.ATTACK,ACTION_TYPE.WAIT], "enemy6.svg", false);
                initStage = new BattleStage("ステージ3：試練の砂漠", "back03.svg");
                break;
            case 7:
                initPlayer = new Character("あなた", 40, 6, 100, 3, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("ガーディアン", 40, 100, 6, 3, 10, [ACTION_TYPE.ATTACK,ACTION_TYPE.GUARD,ACTION_TYPE.SKILL,ACTION_TYPE.HEAL,ACTION_TYPE.WAIT], "enemy7.svg", false);
                initStage = new BattleStage("ステージ4：魔王の城", "back04.svg");
                break;
            case 8:
                initPlayer = new Character("あなた", 40, 100, 6, 3, 10, ACTION_LIST, "player.svg", true)
                initEnemy = new Character("魔王", 50, 120, 8, 4, 10, [ACTION_TYPE.SKILL,ACTION_TYPE.SKILL,ACTION_TYPE.GUARD,ACTION_TYPE.ATTACK,ACTION_TYPE.GUARD,ACTION_TYPE.HEAL], "enemy8.svg", false);
                initStage = new BattleStage("ステージ4：魔王の城", "back04.svg");
                break;
        }

        if(initPlayer && initEnemy && initStage) {
            setPlayer(initPlayer)
            setEnemy(initEnemy);
            setStage(initStage);
        }
        setIsLoading(false);

        intervalRef.current = setInterval(() => {
            setTurnCount((prevCount) => prevCount + 1);
        }, BATTLE_PROGRESS_TIME);

        // コンポーネントがアンマウントされた時にintervalをクリア
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [])

    /**
     * 毎ターン処理のuseEffect
     */
    useEffect(() => {
        if(!player || !enemy) {
            return;
        }
        let players: Character[] = [player, enemy];
        players.sort((a, b) => b.getSpeed() - a.getSpeed());
        /**
         * 1ターンの処理
         */
        const executeTurn = async (): Promise<void> => {
            
            setBattleLog((prevLog) => [...prevLog, `ーーー${turnCount}ターン目ーーー`]);
            
            for(const playerLog of players[0].action(players[1])) {
                setBattleLog((prevLog) => [...prevLog, playerLog]);
            }

            if(battleEndIfNeed()) {
                return;
            }

            await wait(BATTLE_WAIT_TIME);
    
            for(const enemyLog of players[1].action(players[0])) {
                setBattleLog((prevLog) => [...prevLog, enemyLog]);
            }

            if(battleEndIfNeed()) {
                return;
            }
        }

        executeTurn();
        
    }, [turnCount])

    const battleEndIfNeed = (): boolean => {
        if(!player || !enemy) {
            return true;
        }
        
        if(player.isDead() || enemy.isDead()) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null; // リセット
                if(player.isDead()) {
                    setBattleLog((prevLog) => [...prevLog, `敗北：${player.getName()}の冒険は終わってしまった…`]);
                } else {
                    setBattleLog((prevLog) => [...prevLog, `勝利：${enemy.getName()}を撃破した！`]);
                }
            }
            return true;
        }
        return false;
    }

    /**
     * バトルログ更新のuseEffect
     */
    useEffect(() => {
        // スクロールを一番下に移動
        if (logContainerRef.current) {
            const container = logContainerRef.current;
            container.scrollTop = container.scrollHeight;
        }
    }, [battleLog]);

    // 背景画像のURLを取得
    const getBackgroundImageUrl = () => {
        return stage ? `/` + stage.getImageName() : '';
    };

    // プレイヤー画像のURLを取得
    const getPlayerImageUrl = () => {
        return player ? `/` + player.getImageName() : '';
    };

    // エネミー画像のURLを取得
    const getEnemyImageUrl = () => {
        return enemy ? `/` + enemy.getImageName() : '';
    };

    return (
        <div className="h-3/5 m-3">
            { isLoading ? (
                <p>ロード中...</p>
            ) : (
                enemy ? (
                    <div>
                        <div className="text-2xl font-bold mb-1 text-center">
                            {stage?.getStageName()}
                        </div>
                        <div className="relative w-full h-[500px] bg-cover bg-center" style={{ backgroundImage: `url(${getBackgroundImageUrl()})` }}>
                            <div className="absolute top-[35%] left-[15%] flex flex-col items-center space-y-2">
                                <div className=" text-1xl font-bold text-center">
                                    {player?.getInfo()}
                                </div>
                                <Image src={getPlayerImageUrl()} alt="bg" width={300} height={300} className="w-[50%] h-auto"/>
                            </div>
                            <div className="absolute top-[35%] left-[60%] flex flex-col items-center space-y-2">
                                <div className="text-1xl font-bold text-center">
                                    {enemy?.getInfo()}
                                </div>
                                <Image src={getEnemyImageUrl()} alt="bg" width={300} height={300} className="w-[50%] h-auto"/>
                            </div>
                            <div className="absolute top-[5%] left-[50%] transform -translate-x-1/2 text-3xl font-bold">
                                {turnCount}ターン目
                            </div>
                            {player?.isDead() && (
                                <Image src="./gameover.svg" alt="bg" width={300} height={300} className="absolute top-[20%] left-[50%] transform -translate-x-1/2 text-3xl"/>
                            )}
                            {enemy?.isDead() && (
                                <Image src="./win.svg" alt="bg" width={300} height={300} className="absolute top-[20%] left-[50%] transform -translate-x-1/2 text-3xl"/>
                            )}
                        </div>
                        <div className="w-full h-[10rem] mt-1 p-2 bg-white overflow-y-scroll border-2" ref={logContainerRef}>
                            {battleLog.map((log, index) => (
                                <p key={index}>{log}</p> // 配列をループ処理で表示
                            ))}
                        </div>
                    </div>
                ) : <p className="text-2xl font-bold mb-1 text-center">ここはモンスターのいない平和な世界のようだ…</p>
            )}
        </div>
    )  
}
