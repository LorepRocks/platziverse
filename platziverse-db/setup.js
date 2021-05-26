'use strict'
const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk');
const db = require('./index.js')


const prompt = inquirer.createPromptModule();

async function setup () {
  
    const answer = await prompt([
        {
            type: 'confirm',
            name: 'setup',
            message: 'This will destroy your database, are you sure?'
        }
    ])

    if(!answer.setup){
        return console.log('Ok nothing happen :)');
    }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  try {
    await db(config)
  } catch (err) {
    handleFatalError(err)
  }

  console.log('Sucess!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
