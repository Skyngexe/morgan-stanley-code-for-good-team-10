import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [itemData, setItemData] = useState();

  const fetchItem = async () => {
    axios
      .get("http://127.0.0.1:5000/form/item")
      .then((response) => {
        console.log(response.data);
        setItemData(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return { error: error };
      });
  };

  //   const fetchResponses = async () => {
  //     axios
  //       .get("http://127.0.0.1:5000/form/responses")
  //       .then((response) => {
  //         console.log(response.data.data);
  //         setResponsesData(response.data.data);
  //         return response.data.data;
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //         return { error: error };
  //       });
  //   };

  //   const fetchForm = async () => {
  //     axios
  //       .get("http://127.0.0.1:5000/form/get")
  //       .then((response) => {
  //         const form = response.data.data;
  //         console.log(form);
  //         setFormData(form);
  //         const questionMap = form.items.reduce((map, item) => {
  //           if (item.questionItem) {
  //             map[item.questionItem.question.questionId] = item.title;
  //           }
  //           return map;
  //         }, {});
  //         console.log(questionMap);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   };

  return (
    <div className="flex flex-col items-center">
      <div className="container">
        <h1>Admin Page</h1>
        <button onClick={fetchItem} className="border">
          Get Item
        </button>
        <ul className="flex flex-col gap-y-4">
          {/* {JSON.stringify(itemData, null, 2)} */}
          {itemData && (
            <>
              {itemData.responses.responses.map((response, i) => {
                const answers = response.answers;
                return (
                  <div className="border">
                    {Object.entries(answers).map(([questionId, answerData]) => (
                      <li key={questionId}>
                        <strong>Question ID:</strong> {questionId} <br />
                        <strong>Question: </strong>{" "}
                        {itemData.questions[questionId]} <br />
                        <strong>Answer:</strong>{" "}
                        {answerData.textAnswers.answers
                          .map((a) => a.value)
                          .join(", ")}
                      </li>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
