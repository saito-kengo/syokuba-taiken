import { ACTION_TYPE, ActionType } from "@/constants/type";
export const P1_ACTION_LIST: ActionType[] = [
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
    ACTION_TYPE.ATTACK,
]

export const PLAYER01 = {
    name: "オーバーフロー",
    hp: 400,
    mp: 0,
    str: 1000000000000000000000000000000000,
    def: 0,
    speed: 0,
    actions: P1_ACTION_LIST,
    image: "player.svg"
}
