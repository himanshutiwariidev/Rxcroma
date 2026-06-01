"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const [message, setMessage] =
    useState("");

  const [reply, setReply] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const askAI = async () => {
    if (!message) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      setReply(data.reply);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Animated Button */}
<div className="fixed bottom-5 right-5 z-50">

  <button
    onClick={() => setOpen(!open)}
    className="
      group
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-full
      bg-gradient-to-r
      from-orange-500
      to-orange-600
      text-white
      shadow-xl
      hover:scale-105
      hover:shadow-2xl
      transition-all
      duration-300
    "
  >

    {/* Icon */}

    <div
      className="
        w-10
        h-10
        rounded-full
        bg-white/20
        flex
        items-center
        justify-center
      "
    >
      <Bot
        size={22}
        className="
          transition-transform
          duration-300
          group-hover:rotate-12
        "
      />
    </div>

    {/* Text */}

    <div className="text-left leading-tight">

      <p className="text-sm font-semibold">
        Rx AI
      </p>

      <p className="text-[10px] opacity-80">
        Ask Medicines
      </p>

    </div>

  </button>

</div>
      {/* Chat Window */}

      {open && (
        <div
          className="
            fixed
            bottom-24
            right-5
            w-[350px]
            bg-white
            rounded-2xl
            shadow-2xl
            border
            z-50
            overflow-hidden
            animate-in
            slide-in-from-bottom-5
            duration-300
          "
        >
          {/* Header */}

          <div
            className="
              bg-gradient-to-r
              from-orange-400
              to-orange-500
              text-white
              p-4
              flex
              items-center
              justify-between
            "
          >
            <div>
              <h2 className="font-bold">
                RXCroma AI
              </h2>

              <p className="text-xs opacity-80">
                Medicine Assistant
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-xl"
            >
              ✕
            </button>
          </div>

          {/* Body */}

          <div className="p-4">

            <textarea
              rows={4}
              placeholder="Ask about medicines..."
              className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-400
              "
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button
              onClick={askAI}
              className="
                w-full
                mt-3
                bg-black
                text-white
                py-3
                rounded-xl
                hover:opacity-90
                transition
              "
            >
              {loading
                ? "Thinking..."
                : "Ask AI"}
            </button>

            {reply && (
              <div
                className="
                  mt-4
                  bg-gray-100
                  p-3
                  rounded-xl
                  text-sm
                  max-h-[250px]
                  overflow-y-auto
                "
              >
                {reply}
              </div>
            )}

            <p
              className="
                text-[10px]
                text-gray-500
                mt-3
              "
            >
              This information is for
              general guidance only.
              Consult a doctor before
              taking medicines.
            </p>
          </div>
        </div>
      )}
    </>
  );
}