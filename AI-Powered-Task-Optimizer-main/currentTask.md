# Current Task: Implement Dual Analysis Modes & Enhanced Task Suggestions

 **Date:** 2025-05-22

 **Objective:** To provide users with two options for facial emotion analysis: single-frame analysis and a 10-second continuous analysis period. Modify the task suggestion feature to display all tasks relevant to the detected emotion. Ensure all interactive buttons use the common `Button.tsx` component.

 **Previous Task Summary (Continuous Analysis & Button Standardization):** 
* Logic for 10-second continuous emotion analysis was implemented in `AnalyzeEmotionPage.tsx`.
* User requested an additional option for single-frame analysis and to display all relevant tasks.

## Task Breakdown & Checklist:

* [x] **1. Backend - Modify Task Suggestion Endpoint:** (Completed 2025-05-22)
    - [x] In `backend/app/services/task_service.py`:
        - Modified `get_task_suggestion_for_emotion` to `get_task_suggestions_for_emotion` and to return a list of all suitable task dictionaries.
    - [x] In `backend/app/api/tasks_router.py`:
        - Updated the `get_task_suggestion_endpoint` (`GET /api/v1/tasks/suggestion`):
            - Changed its response model (`TaskSuggestionResponse`) to include `suggested_tasks: List[Task]`.
            - Updated logic to use new service function and return all suitable tasks.

* [x] **2. Frontend - `AnalyzeEmotionPage.tsx` Enhancements:** (Completed 2025-05-22)
    - [x] **UI for Dual Analysis Modes:** 
        - Added two distinct buttons: "Analyze Single Frame" and "Start 10-Sec Analysis".
    - [x] **Single-Frame Analysis Logic (`captureSingleFrameAndAnalyze` function):** 
        - Implemented one-time capture, analysis, and call to `fetchTaskSuggestionsList`.
    - [x] **Continuous Analysis Logic (`startAnalysisPeriod` function):** 
        - Existing logic adapted; `processCollectedEmotions` calls `fetchTaskSuggestionsList`.
    - [x] **New `fetchTaskSuggestionsList` function:** 
        - Implemented to call the updated backend endpoint and handle a list of tasks.
        - Updates `suggestedTasksList` state.
    - [x] **Displaying Multiple Task Suggestions:** 
        - JSX modified to render a list of suggested tasks.
    - [x] Ensured all buttons on this page use the common `<Button />` component.

* [ ] **3. Frontend - General Button Replacement (Final Check):** 
    - [ ] Briefly re-check `AddTaskPage.tsx`, `RemoveTaskPage.tsx`, `NotFoundPage.tsx` (if applicable for any non-Link buttons) to ensure all clickable actions that are not navigational links are using the `<Button />` component.

* [ ] **4. Testing:** 
    - [ ] Test single-frame analysis: verify correct emotion and all related tasks are shown.
    - [ ] Test 10-second continuous analysis: verify correct aggregated emotion and all related tasks are shown.
    - [ ] Test scenarios where no tasks match the detected emotion for both modes.
    - [ ] Test UI feedback and button states for both analysis modes.
    - [ ] Confirm all buttons across the application are consistently styled and functional.

## Implementation Notes:

* The backend change to the suggestion endpoint is critical before fully implementing the frontend display of multiple tasks.
* The `AnalyzeEmotionPage.tsx` will become more complex; manage state carefully.
* Consider user experience for displaying potentially many suggested tasks (e.g., scrollable list).

## Acceptance Criteria:

* User can choose between "Analyze Single Frame" and "Start 10-Sec Analysis" on the Analyze Emotion page.
* Both analysis modes correctly detect an emotion and then display a list of all tasks associated with that emotion.
* If no tasks are associated, an appropriate message is shown.
* All action-triggering buttons in the application use the common `Button.tsx` component.
