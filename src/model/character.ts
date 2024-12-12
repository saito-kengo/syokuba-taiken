import { ACTION_TYPE, ActionType } from "@/constants/type";
import { CRITICAL_CORRECTION_VALUE, CRITICAL_RATIO, CRITICAL_THRESHOLD, DOUBLE_ATTACK_NEED_MP, DOUBLE_ATTACK_RATIO, GUARD_RATIO, HEAL_NEED_MP, HEAL_RATIO, PARAM_MAX, POISON_DAMAGE, POISON_NEED_MP, POISON_TRUN_LIMIT as POISON_TURN_LIMIT, SKILL_NEED_MP, SKILL_RATIO, SKILLED_RECEIVE_DAMAGE_RATIO } from "@/constants/appParameter";

export class Character {

    private isGuard: boolean = false;
    private isUseSkill: boolean = false;
    private isPoison: boolean = false;
    private poisonTurnCount: number = 0;

    constructor(
        private name: string,
        private hp: number,
        private mp: number,
        private str: number,
        private def: number,
        private speed: number,
        private actionList: ActionType[],
        private imageName: string,
        private isPlayer: boolean
    ) {
        if(hp + mp + speed + str + def > PARAM_MAX) {
            name = name + "オーバーフロー";
            hp = 1;
            str = 1;
            def = 1;
        }
    }

    public getInfo(): string {
        let info = `${this.name} 残りHP：${this.hp}/MP：${this.mp}`
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

    public getSpeed(): number {
        return this.speed;
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
            logs.push(`${this.name}は毒を受けている！${POISON_DAMAGE}のダメージを受けた！`)
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
                damage = Math.max(damage - enemy.def, 1);
                if (enemy.isUseSkill) {
                    damage = damage * SKILLED_RECEIVE_DAMAGE_RATIO;
                }
                if(this.isCritical()) {
                    logs.push(`クリティカル！`)
                    damage = damage * CRITICAL_RATIO;
                }
                this.attack(enemy, damage);
                logs.push(`${this.name}は${enemy.name}に攻撃をした！${damage}のダメージを与えた！`)
                break;
            case ACTION_TYPE.GUARD:
                this.guard();
                logs.push(`${this.name}は防御した！次に受けるダメージを半減！`)
                break;
            case ACTION_TYPE.HEAL:
                if(this.mp < HEAL_NEED_MP) {
                    logs.push(`${this.name}はヒールを使った！しかしMPが足りなかった！`)
                    break;    
                }
                this.heal();
                logs.push(`${this.name}はヒールを使った！HPを${this.str}回復した！`)
                break;
            case ACTION_TYPE.SKILL:
                if(this.mp < SKILL_NEED_MP) {
                    logs.push(`${this.name}の決死の一撃！しかしMPが足りなかった！`)
                    break;    
                }
                let skillDamage = Math.ceil(enemy.isGuard ? this.str * SKILL_RATIO * GUARD_RATIO : this.str * SKILL_RATIO);
                if (enemy.isUseSkill) {
                    skillDamage = skillDamage * SKILLED_RECEIVE_DAMAGE_RATIO;
                }
                if(this.isCritical()) {
                    logs.push(`クリティカル！`)
                    skillDamage = skillDamage * CRITICAL_RATIO;
                }
                this.skill(enemy, skillDamage);
                logs.push(`${this.name}の決死の一撃！${skillDamage}のダメージを与えたが、隙だらけになってしまった！`)
                break;
            case ACTION_TYPE.POISON:
                if(this.mp < POISON_NEED_MP) {
                    logs.push(`${this.name}の毒攻撃！しかしMPが足りなかった！`)
                    break;    
                }
                this.poison(enemy);
                logs.push(`${this.name}の毒攻撃！${enemy.name}は毒になった！`)
                break;
            case ACTION_TYPE.DOUBLE_ATTACK:
                logs.push(`${this.name}のダブルアタック！`)
                if(this.mp < DOUBLE_ATTACK_NEED_MP) {
                    logs.push(`しかしMPが足りなかった！`)
                    break;    
                }
                this.mp -= Math.max(DOUBLE_ATTACK_NEED_MP, 0)
                for(let i: number = 0; i < 2; i++) {
                    let damage = Math.ceil(enemy.isGuard ? this.str * DOUBLE_ATTACK_RATIO * GUARD_RATIO : this.str * DOUBLE_ATTACK_RATIO);
                    damage = Math.max(damage - this.def, 1);
                    if (enemy.isUseSkill) {
                        damage = damage * SKILLED_RECEIVE_DAMAGE_RATIO;
                    }
                    if(this.isCritical()) {
                        logs.push(`クリティカル！`)
                        damage = damage * CRITICAL_RATIO;
                    }
                    this.attack(enemy, damage);
                    logs.push(`${this.name}は${enemy.name}に攻撃をした！${damage}のダメージを与えた！`)
                }
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
        return randomValue < (CRITICAL_THRESHOLD + (this.speed / CRITICAL_CORRECTION_VALUE));
    }

    public attack(enemy: Character, damage: number): void {
        enemy.receiveDamage(damage);
    }

    public guard(): void {
        this.isGuard = true;
    }

    public heal(): void {
        this.hp += this.str * HEAL_RATIO;
        this.mp -= Math.max(HEAL_NEED_MP, 0);
    }

    public skill(enemy: Character, damage: number): void {
        enemy.receiveDamage(damage);
        this.isUseSkill = true;
        this.mp -= Math.max(SKILL_NEED_MP, 0);
    }

    public poison(enemy: Character): void {
        enemy.setPoison();
        this.mp -= Math.max(POISON_NEED_MP, 0);
    }

}