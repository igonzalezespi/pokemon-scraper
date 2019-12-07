export class AttackService {
    public static url = 'https://www.serebii.net/attackdex-swsh/';
    public static selectors = {
        name: 'h1',
        // .attr('href').replace('/attackdex-swsh/', '').replace('.shtml', '')
        type: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(2) td:nth-child(2) > a',
        // .attr('href').replace('/attackdex-swsh/', '').replace('.shtml', '')
        category: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(2) td:nth-child(3) > a',
        pp: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(4) td:nth-child(1)',
        basepower: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(4) td:nth-child(2)',
        precision: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(4) td:nth-child(3)',
        effect: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(6)',
        secondEffect: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(8) td:first-child',
        // .text().replace('%', '')
        probEffect: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(8) td:nth-child(2)',
        maxMove: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(10) td:nth-child(1)',
        maxMovePower: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(10) td:nth-child(2)',
        // .text().replace('%', '')
        probCrit:'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(12) td:nth-child(1)',
        priority: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(12) td:nth-child(2)',
        target: 'main div:nth-child(3) table.dextable:nth-of-type(3) > tbody > tr:nth-child(12) td:nth-child(3)',
        // .text() === 'Yes'
        contact: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(2)',
        // .text() === 'Yes'
        sound: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(2) td:nth-child(1)',
        // .text() === 'Yes'
        punch: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(2) td:nth-child(2)',
        // .text() === 'Yes'
        snatchable: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(2) td:nth-child(3)',
        // .text() === 'Yes'
        gravity: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(2) td:nth-child(4)',
        // .text() === 'Yes'
        defrost: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(4) td:nth-child(1)',
        // .text() === 'Yes'
        reflect: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(4) td:nth-child(3)',
        // .text() === 'Yes'
        block: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(4) td:nth-child(4)',
        // .text() === 'Yes'
        copy: 'main div:nth-child(3) table.dextable:nth-of-type(4) > tbody > tr:nth-child(4) td:nth-child(5)',
    };
}