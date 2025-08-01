import { use, useEffect } from "react";
import { OpinionsContext } from "../store/opinions-context";
import { useOptimistic } from "react";
import { useActionState } from "react";
import { useOptimisticWithPending } from "../hooks/useOptimisticWithPending";

export function Opinion({ opinion: { id, title, body, userName, votes } }) {

  const { upvoteOpinion, downvoteOpinion } = use(OpinionsContext);


  const {
    optimisticValue,
    executeAction,
    isProcessing
  } = useOptimisticWithPending(votes)




  function handleUpvote() {
    executeAction(optimisticValue + 1, async () => await upvoteOpinion(id));
  }

  function handleDownvote() {
    executeAction(optimisticValue - 1, async () => await downvoteOpinion(id));
  }


  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        <button
          formAction={handleUpvote}
        // disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        {/* <span>isProcessing: {isProcessing ? 'sim' : 'nao'}</span> */}
        <span>{optimisticValue}</span>

        <button
          formAction={handleDownvote}
        // disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}
