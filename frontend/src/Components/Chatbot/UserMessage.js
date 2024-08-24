import React from "react";

export default function UserMessage({ text }) {
  return (
    <div className="chat chat-end">
      <div className="chat-bubble chat-bubble-warning bg-[#fded1c] text-left break-words">{text}</div>
    </div>
  );
}
