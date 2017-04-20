const Alexa = require('alexa-sdk');

const OpearloAnalytics = require('opearlo-analytics');

// const APP_ID = 'amzn1.ask.skill.4af154b7-b157-499d-aa15-16f4e2fb197d';
const opearloApiKey = 'RrTGUvJLyz3w5yR8zaC5p5V7Q83VCnfv6M8fnrCE';
const opearloUserId = 'kJnUOYznWOZmmLEv4aUesaMrOg63';
const voiceAppName = 'footy-facts';

const reprompt = 'Ask me for a footy fact';
const helpMessage = 'Ask me for a footy fact';

const handlers = {
  'LaunchRequest': function () {
    this.emit(':ask', 'Welcome to Footy Facts! Ask me for a fact to get started!', reprompt);
  },
  'GetFactIntent': function () {
    OpearloAnalytics.getVoiceContent(opearloUserId, voiceAppName, opearloApiKey, 'random-footy-facts', (result) => {
      this.emit(':ask', result, reprompt);
    });
  },
  'AMAZON.StopIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, opearloApiKey, (result) => {
      this.emit(':tell', 'Thanks for using footy facts. Goodbye!');
    });
  },
  'AMAZON.CancelIntent': function () {
    OpearloAnalytics.recordAnalytics(this.event.session.user.userId, opearloApiKey, (result) => {
      this.emit(':tell', 'Thanks for using footy facts. Goodbye!');
    });
  },
  'AMAZON.HelpIntent': function () {
    this.emit(':ask', helpMessage, reprompt);
  },
  'AMAZON.YesIntent': function () {
    this.emit('GetFactIntent');
  },
  'AMAZON.NoIntent': function () {
    this.emit('AMAZON.StopIntent');
  },
  'SessionEndedRequest': function () {
    // Use this function to clear up and save any data needed between sessions
    this.emit('AMAZON.StopIntent');
  },
  'Unhandled': function () {
    this.emit(':ask', helpMessage, reprompt);
  },
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  if (event.session.new) {
    OpearloAnalytics.initializeAnalytics(opearloUserId, voiceAppName, event.session);
  }
  if (event.request.type === 'IntentRequest') {
    OpearloAnalytics.registerVoiceEvent(event.session.user.userId, 'IntentRequest', event.request.intent);
  }
  alexa.execute();
};
