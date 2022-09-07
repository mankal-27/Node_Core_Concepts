const Todos = require('./index');
const assert = require('assert').strict;

describe("integration test", function() {
    it("should be able to add and complete TODOs", function() {
        let todos = new Todos();
        todos.add("get up from bed");
        todos.add("make up bed");
        assert.notStrictEqual(todos.list().length, 0);
    });
});