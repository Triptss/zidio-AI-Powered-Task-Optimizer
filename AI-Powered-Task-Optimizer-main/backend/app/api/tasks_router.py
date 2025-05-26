from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional
# Corrected import paths assuming 'app' is the root for these modules from main.py's perspective
from app.models.task_models import Task, TaskCreate, TaskSuggestionResponse 
from app.services import task_service 

router = APIRouter()

@router.post("/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task_endpoint(task_data: TaskCreate):
    """
    Create a new task.
    """
    created_task_data = task_service.create_new_task(
        description=task_data.description,
        associated_emotions=task_data.associated_emotions
    )
    # Convert dict back to Task model for response validation
    return Task(**created_task_data)

@router.get("/tasks", response_model=List[Task])
async def list_tasks_endpoint():
    """
    List all tasks.
    """
    tasks_data = task_service.get_all_tasks()
    # Convert list of dicts to list of Task models
    return [Task(**task) for task in tasks_data]

@router.get("/tasks/suggestion", response_model=TaskSuggestionResponse)
async def get_task_suggestion_endpoint(emotion: str = Query(..., description="The detected emotion to get tasks for.")):
    """
    Get all task suggestions for a given emotion.
    """
    suitable_tasks_data = task_service.get_task_suggestions_for_emotion(emotion) # Use new service function name
    
    if not suitable_tasks_data: # Check if the list is empty
        return TaskSuggestionResponse(suggested_tasks=[], message=f"No specific tasks found for emotion: {emotion}. Why not add some or try a general wellness activity?")
    
    # Convert list of dicts to list of Task models
    suggested_tasks_models = [Task(**task_data) for task_data in suitable_tasks_data]
    return TaskSuggestionResponse(suggested_tasks=suggested_tasks_models, message="Here are some task suggestions for you:")

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task_endpoint(task_id: str):
    """
    Delete a task by its ID.
    """
    deleted = task_service.delete_task_by_id(task_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return # No content response for successful deletion
