// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const {CustomQuestionAnswering} = require('botbuilder-ai');
const IntentRecognizer = require("./intentrecognizer");

const DentistScheduler = require('./dentistscheduler');

class DentaBot extends ActivityHandler {
    constructor(configuration, qnaOptions) {
        // call the parent constructor
        super();
        if (!configuration) throw new Error('[DentaBot]: Missing parameter. configuration is required');

        // create a QnAMaker connector
        this.qnaMaker = new CustomQuestionAnswering(configuration.QnAConfiguration);
        
        // create a DentistScheduler connector
        this.dentistScheduler = new DentistScheduler(configuration.SchedulerConfiguration);
    
        // create a IntentRecognizer connector
        this.intentRecognizer = new IntentRecognizer(configuration.CluConfiguration);

        this.onMessage(async (context, next) => {
            // send user input to QnA Maker and collect the response in a variable
            // don't forget to use the 'await' keyword
            const qnaResults = await this.qnaMaker.getAnswers(context);
            console.log('[DentaBot]: ', qnaResults)

            // send user input to IntentRecognizer and collect the response in a variable
            // don't forget 'await'
            const cluResults = await this.intentRecognizer.executeCluQuery(context);
            console.log('[DentaBot]: ', cluResults)
                                           
           // determine which service to respond with based on the results from LUIS //
            if(cluResults.result.prediction.topIntent === "getAvailability" && cluResults.result.prediction.intents[0].confidence > .75){
                console.log('[DentaBot]: topIntent is getAvailability');
                const schedulerResults = await this.dentistScheduler.getAvailability();
                await context.sendActivity(schedulerResults);
                await next();
                return;
            }
            else if(cluResults.result.prediction.topIntent === "scheduleAppointment" && cluResults.result.prediction.intents[0].confidence > .75 && cluResults.result.prediction.entities.length > 0){
                console.log('[DentaBot]: topIntent is scheduleAppointment');
                const appointment = cluResults.result.prediction.entities;

                if (appointment[0].category === "Date-Time" && (appointment !== undefined || appointment != null)) {
                    console.log('[DentaBot]: appointment is ', appointment[0].text)
                    const schedulerResults = await this.dentistScheduler.scheduleAppointment(appointment[0].text);
                    await context.sendActivity(schedulerResults);
                    await next();
                    return;
                }
                else {
                    await context.sendActivity("I apologize for the confusion. Could you please provide the date and time for your appointment? This will help me assist you better.");
                    await next();
                    return;
                }
            }
            else if(qnaResults[0].score > .75) {
                await context.sendActivity(`${qnaResults[0].answer}`);
            }
            else {
                await context.sendActivity(`I'm sorry, I didn't quite catch that. Feel free to ask me anything about your dental appointments, and I'll do my best to assist you.`);
            }
             
            await next();
    });

        this.onMembersAdded(async (context, next) => {
        const membersAdded = context.activity.membersAdded;
        //write a custom greeting
        const welcomeText = 'Welcome to DentalCare Bot. I am here to assist you with any questions or concerns related to dental care. Feel free to ask me about appointment schedules, dental procedures, or any other information you may need.';
        for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
            if (membersAdded[cnt].id !== context.activity.recipient.id) {
                await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            }
        }
        // by calling next() you ensure that the next BotHandler is run.
        await next();
    });
    }
}

module.exports.DentaBot = DentaBot;