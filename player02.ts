import { ACTION_TYPE, ActionType } from "@/constants/type";

export const P2_ACTION_LIST: ActionType[] = [ACTION_TYPE.SKILL,ACTION_TYPE.HEAL,ACTION_TYPE.SKILL,ACTION_TYPE.GUARD]

export const PLAYER02 = {
    name: "ちきばんてぇてぇ",
    hp: 50,
    mp: 40,
    str: 210    ,
    def: 0,
    speed: 100,
    actions: P2_ACTION_LIST,
    image: "フリーナ.jpg"
}
