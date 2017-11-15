'use strict';

const getUserName = require('./user');
const getAWord = require('./words');

const stateContext = require('../state/stateContext');

const noUserMode = true;

module.exports = (function() {

  return {
    stopIt: (session) => {

      session.emit(':saveState', true); //Save the state
      let userName = session.attributes['userName'];
      if (userName ) {
        session.emit(':tell', `Bye ${userName}!`);
      } else {
        session.emit(':tell', `OK bye`);
      }
    },

    newSession: (session) => {
      // Check for User Data in Session Attributes
      let userName = session.attributes['userName'];
      if (!noUserMode && userName) {
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        session.emit(':saveState', true); //Save the state
        return session.emitWithState('LaunchRequest')
      } else {
        // Welcome User for the First Time
        return session.emit(':ask', 'Welcome to the oblic strategy! you can ask me for a tip or advise by saying <break time="0.5s"/>tell me a strategy',
        'you can ask me for a tip or advise by saying <break time="0.5s"/>tell me a strategy');
      }
    },

    launchRequest: (session) => {
      // Check for User Data in Session Attributes
      let userName = "" + session.attributes['userName'];
      if (!noUserMode && !userName) {
        session.handler.state = stateContext.states.IDENTIFICATION;
        session.emit(':saveState', true); //Save the state
        session.emitWithState('NewSession')
      } else {
        // greet the user by name
        session.emit(':ask', `Welcome ${userName}! you can ask me for a tip or to repeat the last one`,
          `you can ask me for a tip or to repeat the last one`);
      }
    },

    captureName: (session) => {
      let userName = getUserName(session);

      // Save Name in Session Attributes
      if (userName) {
        session.attributes['userName'] = userName;
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        session.emit(':saveState', true); //Save the state
        session.emit(':ask', `Ok ${userName} ! Let\'s get started. you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`);
      } else {
        session.emit(':ask', `Sorry, I didn\'t recognise that name!`, `Tell me your name by saying: My name is, and then your name.`);
      }
    },
    startContest: (session) => {
        return startWordContest(session);
    },

    treatAnswer: (session) => {
        //TODO several steps of tips
          session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
          session.emit(':saveState', true); //Save the state
          return session.emitWithState('StartIntent');
    },

    repeatQuestion: (session) => {
      let word = session.attributes['word'];
      let userName = "" + session.attributes['userName'];
      if (!userName) {
        userName = "";
      }
      if (!word) {
        session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
        session.emit(':saveState', true); //Save the state
        return session.emitWithState('StartIntent');
      } else {
        session.emit(':ask',
          `${userName} My advice is: <break time="0.5s"/> ${word.text}`,
          `${userName} My advice is: <break time="0.5s"/> ${word.text}`);
      }
    },

    helpIdentification: (session) => {
      session.emit(':ask', `you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`,
        `you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`);
    },

    helpQuestionning: (session) => {
      session.emit(':ask', `you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`,
        `you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`);
    },

    helpBetweenQuestions: (session) => {
      session.emit(':ask', `you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`,
        `you can ask me for a tip or to repeat the last one`, `you can ask me for a tip or to repeat the last one`);
    },

    cancel: (session) => {
      session.emit(':tell', 'OK.');
    },

    unhandled: (session) => {

      session.emitWithState('AMAZON.HelpIntent');
    }

  }
})();

function startWordContest(session){
  let word = getAWord();
  session.attributes['word'] = word;
  if (word.status.end){
    session.handler.state = stateContext.states.BETWEEN_QUESTIONS;
  } else {
    session.handler.state = stateContext.states.QUESTIONNING;
  }
  session.emit(':saveState', true); //Save the state

  session.emit(':ask',
    `My advice is: <break time="0.5s"/> ${word.text}`,
    `My advice is: <break time="0.5s"/> ${word.text}`);
}
