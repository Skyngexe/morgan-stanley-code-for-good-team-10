import React, { useEffect, useRef } from "react";

export default function Messages({ messages }) {
  const el = useRef(null);
  useEffect(() => {
    el.current.scrollIntoView({ block: "end", behavior: "smooth" });
  });
  return (
    <div className="w-full h-[400px] overflow-auto flex flex-col gap-y-2 p-2.5">
      {messages}
      <div id={"el"} ref={el} />
    </div>
  );
}