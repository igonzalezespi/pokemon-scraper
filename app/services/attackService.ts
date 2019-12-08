import async from "async";
import randomNumber from "random-number";
import {argv} from "yargs";
import {UtilService} from "./utilService";

export class AttackService {
    public static url = 'https://www.serebii.net';
    public static selectors = {
        name: 'h1',
        type1: 'tr:contains(Battle Type)',
        type2: 'td:nth-child(2) > a',
        category1: 'tr:contains(Category)',
        category2: 'td:nth-child(3) > a',
        powerPoints1: 'tr:contains(Power Points)',
        powerPoints2: 'td:nth-child(1)',
        basePower1: 'tr:contains(Base Power)',
        basePower2: 'td:nth-child(2)',
        accuracy1: 'tr:contains(Accuracy)',
        accuracy2: 'td:nth-child(3)',
        battleEffect1: 'tr:contains(Battle Effect)',
        battleEffect2: 'td:nth-child(1)',
        secondaryEffect1: 'tr:contains(Secondary Effect)',
        secondaryEffect2: 'td:nth-child(1)',
        effectRate1: 'tr:contains(Effect Rate)',
        effectRate2: 'td:nth-child(2)',
        maxMove1: 'tr:contains(Corresponding Max Move)',
        maxMove2: 'td:nth-child(1)',
        maxMovePower1: 'tr:contains(MaxMove Power)',
        maxMovePower2: 'td:nth-child(2)',
        critRate1: 'tr:contains(Base Critical Hit Rate)',
        critRate2: 'td:nth-child(1)',
        priority1: 'tr:contains(Speed Priority)',
        priority2: 'td:nth-child(2)',
        target1: 'tr:contains(Pokémon Hit in Battle)',
        target2: 'td:nth-child(3)',
        contact1: 'tr:contains(Physical Contact)',
        contact2: 'td:nth-child(1)',
        sound1: 'tr:contains(Sound-Type)',
        sound2: 'td:nth-child(2)',
        punch1: 'tr:contains(Punch Move)',
        punch2: 'td:nth-child(3)',
        snatchable1: 'tr:contains(Snatchable)',
        snatchable2: 'td:nth-child(4)',
        gravity1: 'tr:contains(Affected by Gravity)',
        gravity2: 'td:nth-child(5)',
        defrost1: 'tr:contains(Defrosts When Used)',
        defrost2: 'td:nth-child(1)',
        reflect1: 'tr:contains(Reflected By Magic Coat/Magic Bounce)',
        reflect2: 'td:nth-child(3)',
        block1: 'tr:contains(Blocked by Protect/Detect)',
        block2: 'td:nth-child(4)',
        copy1: 'tr:contains(Copyable by Mirror Move)',
        copy2: 'td:nth-child(5)',
    };
    public static attacksMap: any = {};

    public static addNames(urls: string[], Attack: string) {
        for (let url of urls) {
            if (!this.attacksMap[url]) {
                this.attacksMap[url] = {};
            }
            this.attacksMap[url][Attack] = true;
        }
    }

    public static fetchAttack(map: AttackMap): Promise<Attack> {
        return UtilService.fetch(AttackService.url + map.url)
            .then(({html, $}) => AttackService.extractInfo(html, $, map.pokemon));
    }

    public static fetchAll(): Promise<Attack[]> {
        let attacks: Attack[] = [];

        // Pasamos de objetos a arrays para iterar fetchAttack
        let urls = Object.keys(this.attacksMap);
        let attackArray: AttackMap[] = [];
        for (let url of urls) {
            attackArray.push(<AttackMap> {
                url,
                pokemon: Object.keys(this.attacksMap[url])
            });
        }
        /* test */
        const test = Number(argv.attack); // Número de ataques a testear
        if (test) { // Para no traernos la lista entera
            let _attacks: AttackMap[] = [];
            for (let i = 0; i < test; i++) {
                let rand = randomNumber({min: 1, max: attackArray.length, integer: true});
                _attacks.push(
                    attackArray[rand]
                );
                attackArray.splice(rand, 1); // Para no repetirlos
            }
            attackArray = _attacks;
        }
        /* /test */
        return Promise.resolve(
            async.eachSeries(
                attackArray,
                async (map: AttackMap, callback) => {
                    let attack = await AttackService.fetchAttack(map);
                    attacks.push(attack);
                    callback();
                }
            )
        )
            .then(() => attacks);
    }

    public static extractInfo(html: string, $: CheerioStatic, pokemon: string[]): Attack {
        let r = {
            name: $(AttackService.selectors.name).text(),
            type: $(AttackService.selectors.type1).next().find(AttackService.selectors.type2).attr('href') || '',
            category: $(AttackService.selectors.category1).next().find(AttackService.selectors.category2).attr('href') || '',
            powerPoints: $(AttackService.selectors.powerPoints1).next().find(AttackService.selectors.powerPoints2).text(),
            basePower: $(AttackService.selectors.basePower1).next().find(AttackService.selectors.basePower2).text(),
            accuracy: $(AttackService.selectors.accuracy1).next().find(AttackService.selectors.accuracy2).text(),
            battleEffect: $(AttackService.selectors.battleEffect1).next().find(AttackService.selectors.battleEffect2).text(),
            secondaryEffect: $(AttackService.selectors.secondaryEffect1).next().find(AttackService.selectors.secondaryEffect2).text(),
            effectRate: $(AttackService.selectors.effectRate1).next().find(AttackService.selectors.effectRate2).text(),
            maxMove: $(AttackService.selectors.maxMove1).next().find(AttackService.selectors.maxMove2).text(),
            maxMovePower: $(AttackService.selectors.maxMovePower1).next().find(AttackService.selectors.maxMovePower2).text(),
            critRate: $(AttackService.selectors.critRate1).next().find(AttackService.selectors.critRate2).text(),
            priority: $(AttackService.selectors.priority1).next().find(AttackService.selectors.priority2).text(),
            target: $(AttackService.selectors.target1).next().find(AttackService.selectors.target2).text(),
            contact: $(AttackService.selectors.contact1).text(),
            sound: $(AttackService.selectors.sound1).text(),
            punch: $(AttackService.selectors.punch1).text(),
            snatchable: $(AttackService.selectors.snatchable1).text(),
            gravity: $(AttackService.selectors.gravity1).text(),
            defrost: $(AttackService.selectors.defrost1).text(),
            reflect: $(AttackService.selectors.reflect1).text(),
            block: $(AttackService.selectors.block1).text(),
            copy: $(AttackService.selectors.copy1).text()
        };
        return <Attack> {
            name: r.name.trim(),
            type: r.type.replace('/attackdex-swsh/', '').replace('.shtml', '').trim(),
            category: r.category.replace('/attackdex-swsh/', '').replace('.shtml', '').trim(),
            powerPoints: Number(r.powerPoints),
            basePower: Number(r.basePower),
            accuracy: Number(r.accuracy),
            battleEffect: r.battleEffect.trim(),
            secondaryEffect: r.secondaryEffect.trim(),
            effectRate: Number(r.effectRate.replace('%', '').replace('--', '100')),
            maxMove: r.maxMove.trim(),
            maxMovePower: Number(r.maxMovePower),
            critRate: Number(r.critRate.replace('%', '').replace('--', '100')),
            priority: Number(r.priority),
            target: r.target.trim(),
            contact: r.contact.trim() === 'Yes',
            sound: r.sound.trim() === 'Yes',
            punch: r.punch.trim() === 'Yes',
            snatchable: r.snatchable.trim() === 'Yes',
            gravity: r.gravity.trim() === 'Yes',
            defrost: r.defrost.trim() === 'Yes',
            reflect: r.reflect.trim() === 'Yes',
            block: r.block.trim() === 'Yes',
            copy: r.copy.trim() === 'Yes',
            pokemon,
        };
    }
}

interface AttackMap {
    url: string;
    pokemon: string[];
}