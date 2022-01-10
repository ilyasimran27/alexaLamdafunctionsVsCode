import express from "express";
import morgan from "morgan";
import Alexa, { SkillBuilders } from "ask-sdk-core";
import { ExpressAdapter } from "ask-sdk-express-adapter";
import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(
  "mongodb+srv://dbUser:dbUserPassword@cluster0.snbyo.mongodb.net/myCrudApp?retryWrites=true&w=majority"
,function(){
console.log('db connected please move forward')
});
const Usage = mongoose.model('Usage', {
  skillName: String,
  clientName: String,
  createdOn: { type: Date, default: Date.now },
});
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    var newUsage = new Usage({
      skillName: "food ordering skill",
      clientName: "saylani class",
    }).save();
      const speakOutput = 'Hi,Welcome to Our Burger Application You can talk me and tell me about the burger you want to order how may I help You?';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};
// const LaunchRequestHandler = {
//   canHandle(handlerInput) {
//     return (
//       Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
//     );
//   },
//   handle(handlerInput) {
//     const speechText = "Welcome to Shenwari restaurant, I am your virtual assistance. you can ask for the menu";
//     const reprompt = "I am your virtual assistant. you can ask for the menu"

//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(reprompt)

//     //   .withSimpleCard(
//     //     "Welcome to your SDK weather skill. Ask me the weather!",
//     //     speechText
//     //   )
//       .getResponse();
//   },
// };
const donateIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'donate';
  },
  handle(handlerInput) {
       let speakOutput = '';
      const userAction=handlerInput.requestEnvelope.request.intent.slots.burger.value;
    
     
      if(userAction=='zinger burger'){
          speakOutput+='We have a yummy zinger burger for you which price is two hundred rupees do you want to order it';
      }
      else if (userAction=='chicken burger'){
           speakOutput+='We have a yummy chicken burger for you which price is One Hundred and fifty rupees do you want to order it';
      }
      else if (userAction=='beef burger'){
           speakOutput+='We have a yummy beef burger for you which price is One Hundred and fifty rupees do you want to order it';
      }
      else if (userAction=='yes'){
           speakOutput+='Thank you for ordering me your burger will arrive at your home with in twenty minutes if You want to place another order please let me know or if you are done please say cancel to acknowledge me';
      }
      else if (userAction=='no'){
           speakOutput+='Thank you for taken interest in me if You want to place other order please let me know or if you are done please say cancel to acknowledge me';
      }
    else {
        speakOutput+='I am waiting your response please let me know what you want?';
    }
    

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
              || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
      const speakOutput = 'Goodbye!';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
  }
};
// const ShowMenuIntentHandler = {
//   canHandle(handlerInput) {
//     return (
//       Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
//       Alexa.getIntentName(handlerInput.requestEnvelope) === "ShowMenuIntent"
//     );
//   },
//   handle(handlerInput) {
//     const speechText = 'In the menu, we have Beef kabab, Mutton kabab, Chicken Reshmi kabab, Gola kabab and Seekh kabab. which one would you like to order?';
//     const reprompt = 'we have Beef kabab, Mutton kabab, Chicken Reshmi kabab, Gola kabab and Seekh kabab.';
//     const cardText = '1. Beef kabab \n2. Mutton kabab \n3. Chicken Reshmi kabab \n4. Gola kabab \n5. Seekh kabab.';

//     return handlerInput.responseBuilder
//       .speak(speechText)
//       .reprompt(reprompt)
//       .withSimpleCard("Zamzam Restaurant Menu",cardText)
//       .getResponse();
//   },
// };

const skillBuilder = SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler, donateIntentHandler,CancelAndStopIntentHandler)
  .addErrorHandlers(ErrorHandler);
const skill = skillBuilder.create();
const adapter = new ExpressAdapter(skill, false, false);

app.use(morgan("dev"));

app.post('/api/v1/webhook-alexa', adapter.getRequestHandlers());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running");
});

app.listen(PORT);
//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