const { ConversationAnalysisClient } = require ("@azure/ai-language-conversations");
const { AzureKeyCredential } = require ("@azure/core-auth");

class IntentRecognizer {
    constructor(config) {
        const cluIsConfigured = config && config.projectName && config.endpointKey && config.endpoint && config.deploymentName;
        if(cluIsConfigured) {
            this.recognizer = new ConversationAnalysisClient(config.endpoint, new AzureKeyCredential(config.endpointKey));
            this.projectName = config.projectName;
            this.deploymentName = config.deploymentName;
        }
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeCluQuery(context) {
        const body = {
            kind: "Conversation",
            analysisInput: {
                conversationItem: {
                    id: "1",
                    participantId: "1",
                    modality: "text",
                    language: "en",
                    text: context.activity.text,
                },
            },
            parameters: {
                projectName: this.projectName,
                deploymentName: this.deploymentName,
            },
        };
        return await  this.recognizer.analyzeConversation(body);
    }
}

module.exports = IntentRecognizer