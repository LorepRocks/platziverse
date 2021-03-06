'use strict'

const test = require('ava');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const agentFixtures = require('./fixtures/agent')

let db = null

let sandbox = null

let MetricStub = {
    belongsTo: sinon.spy()
}
let AgentStub = null
let config = {
    logging: function() {}
}

test.beforeEach(async () => {
    sandbox = sinon.createSandbox()
    AgentStub= {
        hasMany: sandbox.spy()
    }

    const setupDatabase = proxyquire('../' , {
        './models/agent': () => AgentStub,
        './models/metric': () => MetricStub
    });
    db = await setupDatabase(config)
})

test.afterEach(() => {
    sandbox && sandbox.restore()
})

test('Agent', t => {
    t.truthy(db.Agent, 'Agent service exist')
});

test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the model')
    t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})