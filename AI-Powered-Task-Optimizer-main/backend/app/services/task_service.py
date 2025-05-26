import json
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Optional
import random
import os

# Adjusted path to be relative to the backend root where main.py will be run from
TASKS_FILE_PATH = "tasks.json" 

# Initialize tasks.json if it doesn't exist or is empty
if not os.path.exists(TASKS_FILE_PATH) or os.path.getsize(TASKS_FILE_PATH) == 0:
    with open(TASKS_FILE_PATH, "w") as f:
        json.dump([], f)

def load_tasks_from_file() -> List[Dict]:
    try:
        with open(TASKS_FILE_PATH, "r") as f:
            tasks_data = json.load(f)
            # Basic migration for older task formats or ensure created_at exists
            for task in tasks_data:
                if 'created_at' not in task or not task['created_at']:
                    task['created_at'] = datetime.now(timezone.utc).isoformat()
                if 'id' not in task or not task['id']: # Ensure ID exists
                    task['id'] = str(uuid.uuid4())
            return tasks_data
    except (FileNotFoundError, json.JSONDecodeError):
        # If file not found or corrupt, return empty list and a new one will be created on save
        return []

def save_tasks_to_file(tasks_data: List[Dict]):
    with open(TASKS_FILE_PATH, "w") as f:
        json.dump(tasks_data, f, indent=4)

def get_all_tasks() -> List[Dict]:
    return load_tasks_from_file()

def create_new_task(description: str, associated_emotions: List[str]) -> Dict:
    tasks = load_tasks_from_file()
    new_task_data = {
        "id": str(uuid.uuid4()),
        "description": description,
        "associated_emotions": [emotion.lower() for emotion in associated_emotions],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    tasks.append(new_task_data)
    save_tasks_to_file(tasks)
    return new_task_data

def get_task_suggestions_for_emotion(emotion: str) -> List[Dict]: # Renamed and changed return type
    normalized_emotion = emotion.lower()
    tasks = load_tasks_from_file()
    
    suitable_tasks = [
        task for task in tasks
        if normalized_emotion in [e.lower() for e in task.get("associated_emotions", [])]
    ]
    
    return suitable_tasks # Return all suitable tasks

def delete_task_by_id(task_id: str) -> bool:
    tasks = load_tasks_from_file()
    initial_length = len(tasks)
    tasks = [task for task in tasks if task.get("id") != task_id]
    
    if len(tasks) < initial_length:
        save_tasks_to_file(tasks)
        return True # Task was found and deleted
    return False # Task not found
