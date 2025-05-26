# Project Brief: TaskNova

## 1. Project Overview

TaskNova is a system designed to leverage data science and machine learning techniques to analyze employee emotions and moods. The primary goal is to enhance employee productivity and well-being by providing insights into their emotional state and recommending tasks that align with their current mood. Additionally, the system aims to detect early signs of stress, burnout, or other negative emotions, notifying HR or higher authorities to enable timely support and intervention. This will foster a healthier and more empathetic workplace environment.

## 2. Core Objectives

- To accurately detect and interpret employee emotions, with an initial MVP focus on facial expressions captured via live camera.
- To provide actionable insights based on the analyzed emotional states.
- To develop a task recommendation engine that suggests mood-appropriate tasks.
- To implement a system for historical mood tracking and trend analysis for individual employees and teams.
- To create an alert mechanism for HR/management regarding employees experiencing prolonged stress or disengagement.
- To ensure robust data privacy and security, including anonymization of sensitive data.
- To refactor the codebase for improved readability, maintainability, and adherence to best practices, including a well-defined folder structure.
- To enhance the frontend with a structured layout including a header and distinct sections for Home, Add Tasks, Remove Tasks, and Give Tasks (Emotion Analysis).

## 3. Key Features

- **Real-Time Emotion Detection:** User can choose between single-frame facial emotion analysis or a 10-second continuous analysis period to determine the most prominent emotion from live camera feed. Text and speech analysis are potential future enhancements.
- **Task Recommendation:** Suggestion of all relevant tasks (from user-defined list) based on the detected mood of the employee.
- **Historical Mood Tracking:** Maintenance of a timeline for each employee's mood trends to identify patterns and provide insights for long-term well-being.
- **Stress Management Alerts:** Automated notifications to HR or managers when an employee's mood indicates prolonged stress or disengagement.
- **Team Mood Analytics:** Aggregation of mood data to identify overall team morale and productivity trends.
- **Data Privacy:** Strict adherence to data privacy principles, ensuring sensitive data is anonymized and securely stored.
- **User-Defined Task Management:** Ability for users to add new tasks (via a dedicated 'Add Tasks' section) and associate them with specific emotions. Includes a 'Remove Tasks' section for managing existing tasks.
- **Structured Frontend UI:** A responsive multi-section frontend with a header, including:
    - Home: Details about the website and team.
    - Add Tasks: Interface for adding new tasks.
    - Remove Tasks: Interface for managing/deleting existing tasks.
    - Give Tasks (Emotion Analysis): The core facial emotion detection and task suggestion feature.
- **Code Refactoring & Best Practices:** Application of good folder structures and coding practices for enhanced readability and maintainability.

## 4. Target Users

- Employees (primary users of task recommendations and mood insights)
- HR Departments (recipients of alerts, users of team analytics)
- Managers (recipients of alerts, users of team analytics)

## 5. Expected Outcomes

- Improved employee well-being and job satisfaction.
- Increased productivity through mood-aligned task management.
- Proactive identification and mitigation of workplace stress and burnout.
- A more empathetic and supportive work culture.
- Data-driven insights for HR and management to improve team dynamics.