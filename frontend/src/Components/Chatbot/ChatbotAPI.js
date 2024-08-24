import axios from "axios";

const API = {
  GetChatbotResponse: async (message) => {
    //   return new Promise(function(resolve, reject) {
    //     setTimeout(function() {
    //       if (message === "hi") resolve("Welcome to chatbot!");
    //       else resolve("echo : " + message);
    //     }, 2000);
    //   });
    try {
        const response = await axios
        .post(
          "http://127.0.0.1:5000/chatbot",
          { question: message },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.answer;
      } catch (error) {
        return error.response.data.error;
      }
  },
};

export default API;
