# Active Context: TaskNova

## Current Focus: Dual Emotion Analysis Modes & Enhanced Task Suggestion

**Date:** 2025-05-22

**Status:** Implementing user choice between single-frame and 10-second continuous emotion analysis. Modifying task suggestion to show all relevant tasks.

## Recent Decisions & Key Insights:

1.  **Project Name:** TaskNova.
2.  **Core Goal (Current Phase):** Provide two analysis modes (single frame, 10s continuous). Suggest all tasks matching the detected emotion. Ensure all buttons use the common `Button` component.
3.  **Technology Stack (Confirmed):
    *   **Frontend:** React with Vite, Tailwind CSS, React Router.
    *   **Backend:** Python with FastAPI.
    *   **Task Storage:** Local JSON file (`tasks.json`).
    *   **ML:** `deepface` for facial emotion recognition (backend processing per frame).
4.  **Expanded Scope (Current Phase):
    *   **Dual Analysis Modes:** Implement UI and logic for both single-frame and 10-second continuous analysis on `AnalyzeEmotionPage.tsx`.
    *   **Display All Suggested Tasks:** Modify frontend to display a list of tasks if multiple are returned by the backend.
    *   **Backend Task Suggestion Update:** Modify `/api/v1/tasks/suggestion` to return all matching tasks.
    *   **Button Replacement:** (Ongoing) Ensure all standard buttons are replaced with `<Button />`.
    *   **Continuous Emotion Analysis:** (Partially Implemented - needs UI for dual mode) Frontend captures frames over 10s, aggregates results.
    *   **Common UI Components:** (Completed) `Button.tsx`, `ConfirmationModal.tsx`.
    *   **Previous Features:** Code refactoring, navigation, page structure, task management (CRUD on tasks.json) are largely in place.
5.  **Architectural Approach:** Modular Monolith (as per `systemPatterns.md`), with new Task Management capabilities.

## Next Steps:

1.  Update `currentTask.md` to detail implementation of dual analysis modes and updated task suggestion display.
2.  Update `progress.md` with these new feature milestones.
3.  Proceed with implementation in Act Mode.

## Resolved Questions:

-   Frontend preference: SvelteKit.
-   Backend preference: Python with FastAPI (reverted for CV).
-   Infrastructure/Constraints: Focus on local development first, simple cloud deployment later if needed. No complex constraints for MVP.
-   ML Model preference: Pre-trained facial emotion recognition model.
-   MVP Priorities: Confirmed focus on facial emotion detection, basic task suggestion, and mood logging.
-   Third-party integrations: None for MVP.