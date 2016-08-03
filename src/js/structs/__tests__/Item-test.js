let Item = require('../Item');

describe('Item', function () {

  describe('#constructor', function () {

    it('sets object properties as instance properties', function () {
      let item = new Item({a: 1, b: 2});
      expect(item.a).toEqual(1);
      expect(item.b).toEqual(2);
    });

  });

  describe('#get', function () {

    it('returns undefined for non existent properties', function () {
      let item = new Item();
      expect(item.get('foo')).toEqual(undefined);
    });

    it('returns property when it exists', function () {
      let item = new Item({foo: 'bar'});
      expect(item.get('foo')).toEqual('bar');
    });

    it('returns all properties when no key is defined', function () {
      let item = new Item({foo: 'bar', baz: 'qux'});
      expect(item.get()).toEqual({foo: 'bar', baz: 'qux'});
    });

  });

  describe('#toJSON', function () {

    it('returns a JSON string with the values in _itemData', function () {
      let item = new Item({foo: 'bar', baz: 'qux'});
      expect(item.toJSON()).toEqual('{"foo":"bar","baz":"qux"}');
    });

  });

});
