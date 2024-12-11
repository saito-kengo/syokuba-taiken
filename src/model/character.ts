import { ACTION_TYPE, ActionType } from "@/constants/type";
import { CRITICAL_RATIO, CRITICAL_THRESHOLD, GUARD_RATIO, PARAM_MAX, POISON_DAMAGE, POISON_TRUN_LIMIT as POISON_TURN_LIMIT, SKILL_RATIO, SKILLED_RECEIVE_DAMAGE_RATIO } from "@/constants/appParameter";

export class Character {

    private isGuard: boolean = false;
    private isUseSkill: boolean = false;
    private isPoison: boolean = false;
    private poisonTurnCount: number = 0;

    constructor(
        private name: string,
        private hp: number,
        private str: number,
        private def: number,
        private actionList: ActionType[],
        private imageName: string,
        private isPlayer: boolean
    ) {
        if(hp + str + def > PARAM_MAX) {
            name = name + "オーバーフロー";
            hp = 1;
            str = 1;
            def = 1;
        }
    }

    public getInfo(): string {
        let info = `残りHP：${this.hp}`
        if(this.isPoison) {
            info += `　毒（残り${this.poisonTurnCount}ターン）`
        }
        return info;
    }

    public getName(): string {
        return this.name;
    }

    public getHp(): number {
        return this.hp;
    }

    public getStr(): number {
        return this.str;
    }

    public getActionList(): ActionType[] {
        return this.actionList;
    }

    public getImageName(): string {
        return this.imageName;
    }

    public setPoison(): void {
        this.isPoison = true;        
        this.poisonTurnCount = POISON_TURN_LIMIT;
    }

    public shiftActionList(): ActionType | undefined {
        const action = this.actionList.shift();
        if(!this.isPlayer && action) {
            this.actionList.push(action)
        }
        return action;
    }
    
    public setCondition(): void {
        this.isGuard = false;
        this.isUseSkill = false;
        if(this.poisonTurnCount == 0) {
            this.isPoison = false;
        }
    }

    public action(enemy: Character): string[] {
        let logs: string[] = [];

        if(this.isPoison) {
            this.receiveDamage(POISON_DAMAGE)
            logs.push(`${this.name}は毒を受けている！${POISON_DAMAGE}を受けた！`)
            this.poisonTurnCount--;
        }

        if(this.isDead()) {
            return logs;
        }
        
        this.setCondition();
        const actionType = this.shiftActionList();

        if(!actionType) {
            logs.push(`${this.name}は行動できなかった！`);
        }

        switch(actionType) {
            case ACTION_TYPE.WAIT: 
                logs.push(`${this.name}はボーっとしている…`);
                break;
            case ACTION_TYPE.ATTACK: 
                let damage = Math.ceil(enemy.isGuard ? this.str * GUARD_RATIO : this.str);
                if (enemy.isUseSkill) {
                    damage = damage * SKILLED_RECEIVE_DAMAGE_RATIO;
                }
                if(this.isCritical()) {
                    logs.push(`クリティカル！`)
                    damage = damage * CRITICAL_RATIO;
                }
                damage = Math.max(damage - this.def, 1);
                this.attack(enemy, damage);
                logs.push(`${this.name}は${enemy.name}に攻撃をした！${damage}のダメージを与えた！`)
                break;
            case ACTION_TYPE.GUARD:
                this.guard();
                logs.push(`${this.name}は防御した！次に受けるダメージを半減！`)
                break;
            case ACTION_TYPE.HEAL:
                this.heal();
                logs.push(`${this.name}はヒールを使った！HPを${this.str}回復した！`)
                break;
            case ACTION_TYPE.SKILL:
                let skillDamage = Math.ceil(enemy.isGuard ? this.str * SKILL_RATIO * GUARD_RATIO : this.str * SKILL_RATIO);
                if (enemy.isUseSkill) {
                    skillDamage = skillDamage * SKILLED_RECEIVE_DAMAGE_RATIO;
                }
                if(this.isCritical()) {
                    logs.push(`クリティカル！`)
                    skillDamage = skillDamage * CRITICAL_RATIO;
                }
                skillDamage = Math.max(skillDamage - this.def, 1);
                this.skill(enemy, skillDamage);
                logs.push(`${this.name}の決死の一撃！${skillDamage}のダメージを与えたが、隙だらけになってしまった！`)
                break;
            case ACTION_TYPE.POISON:
                this.poison(enemy);
                logs.push(`${this.name}の毒攻撃！${enemy.name}は毒になった！`)
                break;
        }
        return logs;
    }

    public receiveDamage(damage: number) {
        this.hp = Math.max(this.hp - damage, 0);
    }

    public isDead(): boolean {
        return this.hp <= 0;
    }

    private isCritical(): boolean {
        const randomValue = Math.random();
        return randomValue < CRITICAL_THRESHOLD;
    }

    public attack(enemy: Character, damage: number): void {
        enemy.receiveDamage(damage);
    }

    public guard(): void {
        this.isGuard = true;
    }

    public heal(): void {
        this.hp += this.str;
    }

    public skill(enemy: Character, damage: number): void {
        enemy.receiveDamage(damage);
        this.isUseSkill = true;
    }

    public poison(enemy: Character): void {
        enemy.setPoison();
    }

}