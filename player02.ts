import { ACTION_TYPE, ActionType } from "@/constants/type";

export const P2_ACTION_LIST: ActionType[] = [ACTION_TYPE.SKILL,ACTION_TYPE.SKILL,ACTION_TYPE.SKILL,ACTION_TYPE.GUARD]

export const PLAYER02 = {
    name: "ちきばんてぇてぇ",
    hp: 10,
    mp: 30,
    str: 210    ,
    def: 0,
    speed: 150,
    actions: P2_ACTION_LIST,
    image: "フリーナ.jpg"
}
