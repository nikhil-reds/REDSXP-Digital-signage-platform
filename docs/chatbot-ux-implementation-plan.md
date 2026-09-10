# AI Assistant chatbot: implementation plan

Status: ready for implementation  
Scope: the floating assistant available in the agent and admin shells  
Primary implementation files: `components/chatbot/floating-chatbot-widget.tsx`, `app/api/agent/assistant/route.ts`, and `lib/bedrock.ts`

## Outcome

Deliver a reliable, accessible assistant panel that feels responsive while the existing read-only Bedrock assistant retrieves tenant-scoped signage data. The panel will render user messages immediately, communicate request progress, stream answers where supported, follow the newest response without interrupting readers, recover cleanly from failures, and retain the in-session conversation when closed.

This plan deliberately does not add system-mutating assistant tools. The assistant remains read-only unless a separately approved backend/tools expansion changes that contract.

## Current baseline and gaps

The existing widget has a branded floating panel, quick chips, immediate user messages, a typing-dots indicator, message cards, and a synchronous `POST /api/agent/assistant` request.

The following gaps are material:

- The response is delivered only after `runAssistant` completes; it cannot progressively render text or be stopped.
- The feed has no scroll ref, bottom detection, automatic follow logic, or “new response” indicator.
- Failed requests are represented as ordinary assistant messages, with no retry associated with the original request.
- The single-line input cannot support Shift+Enter, growth limits, or a useful generation stop state.
- Voice mode is simulated but shown as a product capability; it is not connected to speech recognition or transcription.
- Conversation state is discarded when the component unmounts and has no clear-conversation action.
- The current API returns an undifferentiated `502`, so client UX cannot distinguish timeout, cancellation, validation, and backend availability states.

## Product decisions to lock before implementation

1. **Voice:** hide the microphone and voice screen for this release. Reintroduce them only after browser support, consent UX, transcription, error states, and a supported backend path are approved.
2. **Persistence:** preserve messages while the panel is closed and through refresh in `sessionStorage`; do not persist them server-side in this scope. Store only message content, IDs, timestamps, and completed/error state—never credentials or raw API failures.
3. **Streaming transport:** use a `POST` response body with Server-Sent Events-style events (not `EventSource`, which only supports GET). This keeps the existing authenticated POST request and enables aborting with `AbortController`.
4. **Markdown:** launch with safe plain text and preserved line breaks. Add markdown rendering only with a vetted renderer and explicit allowlist/sanitization; do not inject model HTML.
5. **Concurrency:** permit one active generation per panel. Disable submit and suggestion actions during it; expose Stop. Do not silently queue requests.

## State model

Model a message independently from its visual sender so recovery is deterministic:

| State | User-visible behavior | Recovery |
| --- | --- | --- |
| `idle` | Composer ready; suggestions visible when conversation is empty | Send a valid prompt |
| `sending` | User message appears immediately; assistant typing dots occupy the reply position | Stop or wait |
| `waiting` | Dots remain; after a short threshold show a response-shaped skeleton in the same slot | Stop or wait |
| `streaming` | Assistant text grows in place with a terminal cursor | Stop, or scroll to newest reply |
| `complete` | Timestamp and secondary copy/feedback actions are available on hover/focus | Copy or send another prompt |
| `failed` | Clear plain-language error paired with Retry | Retry the original user prompt |
| `cancelled` | Preserve any partial text; label the response “Stopped” | Retry the original user prompt |

The request lifecycle is `idle → sending → waiting → streaming → complete`, with explicit transitions to `failed` or `cancelled`. A timer should only reveal the skeleton when no response content has arrived after the agreed threshold (recommend 800 ms); it must never intentionally delay a fast answer.

## Delivery phases

### Phase 1 — data contracts and request lifecycle

- Replace the current `ChatMsg` shape with stable message IDs, a delivery state, optional partial content, retry metadata, and immutable original prompt text.
- Extract the chat feed, message row, composer, and assistant request logic into focused components/hooks only where this reduces state coupling. Keep the public floating-widget integration unchanged in `components/layout/agent-shell.tsx` and `app/(admin)/admin/layout.tsx`.
- Add an `AbortController` ref for the active request. Stop must abort the browser request, clear loading UI, and retain any received content.
- Guard against duplicate form submissions and rapid chip presses. Trim input, keep the existing 2,000-character server limit, and show a local character limit/error before network submission.
- Convert quick actions to send their prompt directly and record the action as a user message. Keep no more than three initial suggestions; hide or replace them after the conversation begins.

**Exit criteria:** every prompt has exactly one associated request; user content is never lost after a request failure or cancellation.

### Phase 2 — streaming API and backend adaptation

- Add a streaming assistant execution path alongside the existing `runAssistant` path. Use Bedrock’s streaming Converse capability where the selected model and tool loop support it; retain the same tenant authorization and read-only tool execution semantics.
- Define small, versioned stream events such as `status`, `delta`, `cards`, `complete`, and `error`. Send only public-safe error messages to the browser; log provider-specific diagnostics server-side.
- Keep tool invocation server-side. Emit status while tools are executing, stream only generated assistant text, and emit cards once tool results are known.
- Return the appropriate HTTP semantics before the stream begins: `422` for invalid history, `401/403` through existing authorization, and a stable unavailable response for provider failures. Once streaming has begun, deliver recoverable failures as an `error` event.
- Keep the present non-stream endpoint temporarily or use content negotiation during rollout so a failed streaming migration can be reverted without removing the proven reply path.

**Exit criteria:** a normal response renders token-by-token; tool-backed cards still appear; disconnect, provider failure, and user cancellation leave the chat in a recoverable state.

### Phase 3 — feed, scrolling, and response presentation

- Give the messages region the single primary vertical scroll container. Header, quick actions, and composer remain fixed.
- Implement `isNearBottom` using the scroll container’s distance from the bottom. Auto-follow only when the user is near the bottom or has just submitted a message.
- On send, scroll the user message into view and follow its expected assistant slot. During streaming, update position without repeatedly smooth-scrolling.
- If the reader scrolls away from the bottom, stop auto-following and display a floating “↓ New response” pill above the composer. The pill includes a count where multiple unread updates are possible, smoothly scrolls on activation, and disappears at the bottom.
- Render typing dots immediately, transition to an accessible response skeleton after the threshold, and replace it in place when the first delta arrives. Add a subtle cursor only while deltas are active.
- Preserve whitespace with `whitespace-pre-wrap`, constrain bubble width, and lay out cards below the assistant response without shifting the feed unnecessarily.
- On completion, show timestamps and reveal Copy, Retry, and optional feedback controls on hover and keyboard focus. Copy only clean response text and provides inline “Copied” feedback.

**Exit criteria:** streaming never pulls a reader away from older messages, the newest content is never hidden behind the composer, and long answers remain readable.

### Phase 4 — composer, keyboard, responsive, and accessibility work

- Replace the single-line input with an auto-resizing textarea: Enter sends, Shift+Enter inserts a newline, it has a defined maximum height, and its focus returns after send/retry.
- Switch Send to Stop during an active generation. Disabled controls retain accessible explanations where appropriate.
- Add a Clear conversation command in the header with confirmation only if there is content. Closing the panel must not clear it.
- Add semantic labels/tooltips for every icon-only control. Use a `role="log"` or a polite live region for completed answers, and concise status announcements for “assistant is responding”, failure, and stopped generation; avoid announcing every streamed token.
- Respect reduced-motion preferences for dots, skeleton shimmer, panel transition, cursor, and scrolling. Keep existing brand tokens and visible focus rings.
- At mobile widths, render the panel nearly full-screen, retain a reachable close button and composer above the keyboard, and keep quick actions in one horizontally scrollable row.

**Exit criteria:** the full panel is keyboard-operable, readable by screen readers without announcement spam, and usable at 390 px and desktop widths.

### Phase 5 — reliability, rollout, and validation

- Add client-side request timeout behavior with a clear retry path. Do not report an aborted request as a generic system failure.
- Validate session restore, malformed stored data, stale in-flight state after reload, API error payloads, empty answers, long answers, and card links.
- Add automated coverage for request-state transitions, retry preserving the prompt, stop behavior, composer shortcuts, and scroll-follow decisions. Add route/API tests for history validation, authorization, stream event order, tool failure, and provider failure.
- Add browser-level checks at 1440 px, 768 px, and 390 px for empty, sending, streaming, reader-scrolled-up, completed, failed, cancelled, and restored conversation states. Include keyboard navigation and reduced-motion checks.
- Run `npm run lint` and `npm run build`; perform a manual authenticated smoke test against a tenant with screens, schedules, alerts, and no-result queries.

**Exit criteria:** all checks pass, a stream failure can be retried without losing context, and product sign-off confirms response speed and accessibility.

## Implementation order and estimate

| Order | Deliverable | Estimate |
| --- | --- | --- |
| 1 | Decisions, message state model, retry/abort plumbing | 0.5–1 day |
| 2 | Bedrock/API streaming path and event contract | 1–2 days |
| 3 | Feed scrolling, typing/skeleton, response actions | 1–1.5 days |
| 4 | Composer, persistence, responsive, accessibility | 1–1.5 days |
| 5 | Tests, browser QA, rollout hardening | 1–1.5 days |

Expected effort: **4.5–7.5 engineering days** for one developer, assuming Bedrock streaming is enabled for the chosen model and no server-side conversation history is required.

## Step-by-step execution checklist

Complete these steps in order. Do not begin the streaming UI until the request contract is decided, and do not remove the existing request path until the streamed path has passed the failure tests.

### Step 1 — confirm scope and release decisions

**Files:** this plan; product/configuration documentation as needed  
**Work:**

- [ ] Confirm that the assistant remains read-only and tenant-scoped.
- [ ] Confirm that the first release uses session-only local persistence, not a database-backed chat history.
- [ ] Confirm that microphone/voice UI is out of scope until actual speech recognition is available.
- [ ] Confirm the response rendering policy: plain text with line breaks now; sanitized markdown only in a later approved increment.
- [ ] Confirm whether streaming is enabled for the configured Bedrock model and AWS account.

**Done when:** these five decisions are recorded and no UI implies a capability that the backend cannot provide.

### Step 2 — inspect and protect the existing behavior

**Files:** `components/chatbot/floating-chatbot-widget.tsx`, `app/api/agent/assistant/route.ts`, `lib/bedrock.ts`  
**Work:**

- [ ] Record current successful answer, tool-card, validation-error, unavailable-backend, and no-result behavior.
- [ ] Verify the current history limit (12), message limit (2,000 characters), authorization check, and tenant ID flow remain required.
- [ ] Identify existing page locations that mount the widget: agent shell and admin layout.
- [ ] Add a small test harness or test data fixture before modifying the API, if test infrastructure is selected.

**Done when:** a regression checklist exists and the existing widget can still retrieve a normal tool-backed answer.

### Step 3 — define client message data and reducer/actions

**Files:** new `components/chatbot/*` state/helper module(s); `floating-chatbot-widget.tsx`  
**Work:**

- [ ] Define `ChatMessage` fields: stable ID, role, text, timestamp, cards, `status`, optional error text, and original prompt/retry linkage.
- [ ] Define statuses: `complete`, `sending`, `waiting`, `streaming`, `failed`, and `cancelled`.
- [ ] Implement explicit actions for user-submit, reply-start, reply-delta, reply-cards, reply-complete, reply-fail, reply-cancel, retry, and clear.
- [ ] Generate IDs independently of timestamps so same-millisecond messages cannot collide.
- [ ] Keep partial assistant text in the message that will become the final answer; do not append a new bubble for every stream chunk.

**Done when:** all UI states can be rendered from state alone, without timing-dependent ad-hoc flags such as the current global `isSending` flag.

### Step 4 — build reliable send, cancel, and retry behavior

**Files:** `floating-chatbot-widget.tsx` and/or a dedicated chat request hook  
**Work:**

- [ ] On submit, append the user message first, clear the composer, create a pending assistant message, and focus the composer.
- [ ] Store the exact submitted prompt and relevant history for Retry.
- [ ] Reject blank and oversized input before requesting the API.
- [ ] Use a single active `AbortController`; reject double-send and chip clicks while a request is active.
- [ ] Implement Stop to abort the request and mark the assistant message as cancelled, retaining any received text.
- [ ] Implement Retry to submit the saved original prompt once, without asking the user to retype it.
- [ ] Map unavailable, validation, timeout, cancellation, and malformed response states to clear user language.

**Done when:** failure, cancellation, and retry preserve the preceding user question and never create duplicate requests.

### Step 5 — create the streaming protocol

**Files:** `app/api/agent/assistant/route.ts`, `lib/bedrock.ts`, shared API types if introduced  
**Work:**

- [ ] Add a `runAssistantStream` implementation using the appropriate Bedrock streaming Converse API.
- [ ] Preserve the existing authorization, tenant boundary, system prompt, tool schema, maximum tool rounds, and error logging.
- [ ] Define and document event payloads:
  - [ ] `status` — typing or tool lookup has begun.
  - [ ] `delta` — next safe text fragment.
  - [ ] `cards` — final tool-derived cards.
  - [ ] `complete` — terminal success event with timestamp/metadata as needed.
  - [ ] `error` — public-safe terminal failure reason.
- [ ] Write the response as a POST-readable streaming body and set no-buffer/no-cache response headers appropriate for deployment.
- [ ] Emit no internal provider messages, model IDs, credentials, stack traces, or tenant-crossing data to the browser.
- [ ] Retain a feature-flagged/non-stream fallback until production validation completes.

**Done when:** a manually tested request receives status, one or more deltas, cards where applicable, then exactly one terminal event.

### Step 6 — connect the client stream parser

**Files:** chat request hook/client helper, `floating-chatbot-widget.tsx`  
**Work:**

- [ ] Read `fetch` response chunks with `ReadableStream.getReader()` and decode event frames safely across chunk boundaries.
- [ ] Change pending state to `streaming` on the first `delta` event.
- [ ] Append each delta to the single pending assistant message.
- [ ] Attach cards when the `cards` event arrives and timestamp/final status on `complete`.
- [ ] Start an 800 ms delayed-skeleton timer after submission; cancel it when the first delta arrives or the request ends.
- [ ] Handle a broken stream, invalid event, and timeout exactly once as a retryable failure.
- [ ] Ensure component close/reopen and unmount clean up readers, timers, and aborted requests safely.

**Done when:** answers visibly stream, including multi-line text; a delayed answer shows dots then skeleton; a broken stream preserves partial content and shows Retry.

### Step 7 — implement the chat feed and smart scrolling

**Files:** message-feed component/new hook; `floating-chatbot-widget.tsx`  
**Work:**

- [ ] Add a ref to the one messages scroll container and a bottom sentinel/ref.
- [ ] Calculate whether the reader is near the bottom using a small fixed threshold.
- [ ] On user send, scroll the new user message and pending answer slot into view.
- [ ] While near the bottom, follow response growth without continuously applying smooth scrolling.
- [ ] When the user scrolls upward, stop auto-following immediately.
- [ ] Display a floating “↓ New response” control above the composer while new content arrives out of view.
- [ ] On pill click, smooth-scroll to the sentinel and clear the unseen state after reaching the bottom.
- [ ] Reserve bottom spacing so the last row and actions cannot sit beneath the composer.

**Done when:** a user can read an older message undisturbed during a long stream and return to the newest answer with one click.

### Step 8 — finish response visual states and actions

**Files:** assistant message row/card components; `app/globals.css` only for reusable animation tokens  
**Work:**

- [ ] Render three animated dots immediately for a pending assistant response.
- [ ] Render a subtle, response-shaped shimmer skeleton only after the delay and in the same reply position.
- [ ] Render a terminal cursor only while text is streaming; remove it on complete/fail/cancel.
- [ ] Show error content with an icon, understandable text, and a visible Retry control.
- [ ] Show cancelled partial answers as “Stopped”, with Retry available.
- [ ] Add Copy for completed/partial assistant text, inline `Copied` confirmation, and optional feedback controls revealed only on hover/focus.
- [ ] Keep cards concise, keyboard reachable, and below their associated response.

**Done when:** every request state has a visually distinct but non-jarring representation, with a recovery action wherever one is possible.

### Step 9 — upgrade composer and suggestions

**Files:** composer component; `floating-chatbot-widget.tsx`  
**Work:**

- [ ] Replace the `input` with an auto-resizing `textarea` with a maximum height.
- [ ] Implement Enter to send and Shift+Enter to insert a newline, without breaking IME composition.
- [ ] Disable Send when the trimmed input is empty and replace Send with Stop while generating.
- [ ] Keep the field focused after send, stop, and retry when the panel remains open.
- [ ] Make quick-action chips submit their prompt as a clear user action, not merely prefill it.
- [ ] Keep only 2–4 relevant chips; show initial chips with the empty state and replace/hide them once a conversation has context.
- [ ] Remove simulated voice controls and mode from this release.

**Done when:** composing a multi-line question, sending via keyboard, stopping a reply, and using a suggestion all behave predictably.

### Step 10 — persistence and panel behavior

**Files:** chat persistence hook/helper; header/widget component  
**Work:**

- [ ] Save completed/current in-session conversation state to a versioned `sessionStorage` key.
- [ ] Validate and safely discard malformed or incompatible stored data.
- [ ] Restore only terminal messages after a reload; convert any stale in-flight state to a clear retryable/cancelled state.
- [ ] Keep chat data when the panel is closed and reopened.
- [ ] Add Clear conversation in the header; request confirmation only when messages exist, then clear state and storage.
- [ ] Keep panel opening/closing within 200–300 ms and respect reduced motion.

**Done when:** closing/reopening and refreshing retain a coherent session, while users can intentionally reset it.

### Step 11 — accessibility and responsive pass

**Files:** widget/components; `app/globals.css`  
**Work:**

- [ ] Give every icon-only button an accessible name; add tooltips where the icon meaning is not obvious.
- [ ] Make focus indicators visible for launcher, close, chips, message actions, scroll pill, textarea, Send/Stop, and Clear.
- [ ] Add polite, brief status announcements for response start, completion, failure, and cancellation; never announce every token.
- [ ] Respect `prefers-reduced-motion` for launch, dots, skeleton, cursor, and scroll effects.
- [ ] Verify text/control contrast with existing REDS tokens; do not introduce raw colors.
- [ ] At 390 px, make the panel near/full-screen, retain a fixed header/composer, make chips horizontally scrollable, and keep controls reachable above the keyboard.
- [ ] Verify Escape behavior does not accidentally lose an unsent message or active response.

**Done when:** keyboard-only and screen-reader flows complete a send/retry/copy/clear cycle at mobile and desktop widths.

### Step 12 — test, release, and remove fallback

**Files:** selected unit/API/browser test locations; CI configuration if required  
**Work:**

- [ ] Test message-state transitions, duplicate-send prevention, retry, stop, timeout, and storage restore.
- [ ] Test API validation, authorization, tenant scope, event order, tool errors, provider errors, and cancellation.
- [ ] Browser-test empty, sending, skeleton, streaming, completed, failed, stopped, reader-scrolled-up, and restored-session states at 1440, 768, and 390 px.
- [ ] Test keyboard navigation, reduced motion, long response layout, long URLs/cards, and no-results answers.
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Run authenticated manual smoke tests for screen status, schedules, playlists, alerts, support, and an unavailable-backend simulation.
- [ ] After stable production validation, remove the temporary non-stream fallback/feature flag only if rollback is no longer required.

**Done when:** all automated checks pass, product owners approve the interaction behavior, and rollback/monitoring ownership is documented.

## Definition of done

- [ ] User messages render immediately and cannot be accidentally duplicated.
- [ ] The assistant shows typing immediately, a delayed skeleton only when warranted, and streamed text with a completion state.
- [ ] Stop, retry, timeout, provider error, and connection loss preserve the relevant message/context and explain the next action plainly.
- [ ] The panel follows new content only while the reader is at the bottom; otherwise it shows a working new-response pill.
- [ ] Header and composer remain fixed around one chat scroll area.
- [ ] Enter/Shift+Enter, focus management, labels, live announcements, contrast, reduced motion, and mobile behavior are verified.
- [ ] Conversation survives close/reopen and refresh for the browser session; Clear conversation is explicit.
- [ ] Voice controls are absent until real voice input is delivered, or the voice implementation meets its own consent, support, and failure requirements.
- [ ] Existing tenant authorization, message size/history limits, and read-only assistant-tool restrictions remain intact.
- [ ] Lint, production build, automated checks, and authenticated manual smoke testing pass.
