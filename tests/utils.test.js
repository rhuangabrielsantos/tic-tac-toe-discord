const { getIdByPlayerMention } = require('../src/utils');

test('given mention, should return id', () => {
    const mention = '<@!123456789>';
    const expectedId = '123456789';

    const idReturned = getIdByPlayerMention(mention);

    expect(idReturned).toBe(expectedId);
});

test('given empty mention, should return a blank mention.', () => {
    const mention = '';

    const idReturned = getIdByPlayerMention(mention);

    expect(idReturned).toBeNull();
});