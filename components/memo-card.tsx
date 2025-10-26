"use client";

import { useState } from "react";

export function MemoCard() {
  const [memoText, setMemoText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");

  const sendMemo = async () => {
    // Memo functionality would be implemented here
    console.log("Memo:", memoText);
  };

  return (
    <div>
      <h3>Send Memo</h3>
      <div>
        <label>Memo Message</label>
        <textarea
          value={memoText}
          onChange={(e) => setMemoText(e.target.value)}
          placeholder="Enter your memo message"
          maxLength={566}
        />
      </div>

      <button
        onClick={sendMemo}
        disabled={isLoading || !memoText.trim()}
      >
        {isLoading ? "Sending..." : "Send Memo"}
      </button>

      {txSignature && (
        <div>
          <p>Memo Sent</p>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Solana Explorer →
          </a>
        </div>
      )}
    </div>
  );
}