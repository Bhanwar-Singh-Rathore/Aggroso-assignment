# AI Notes

## AI Tools Used

- **Generative AI (Agent)**: Used to scaffold the project, generate code for components, and implement logic.
- **LLM Integration**: The app connects to OpenAI (GPT-4o-mini) or Google Gemini (Flash 1.5) for the core feature of extracting action items.

## What I Checked Myself

- **Code Quality**: Verified component structure and React best practices (hooks rules, state management).
- **Security**: Ensured API keys are NOT stored in the code but are handled via LocalStorage on the client side (User inputs their own key).
- **UX/UI**: Manually refined the Tailwind classes to ensure a clean, responsive "Glassmorphism" look.
- **Error Handling**: Added try/catch blocks around API calls and JSON parsing to prevent app crashes on malformed LLM responses.

## Logic & Prompts

The core logic relies on a system prompt that instructs the LLM to output a strict JSON array. I verified that the prompt robustly handles unstructured text and returns the expected schema (`task`, `owner`, `dueDate`, `done`).
