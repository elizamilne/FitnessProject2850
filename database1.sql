create TABLE users
user_id 
name
email
password
weight
height
fitness_goal (Lose fat / Gain muscle / Maintain)

create TABLE workouts 
workout_id 
workout_name
difficulty_level
duration_minutes

create TABLE exercise
exercise_id
exercise_name
muscle_group
equipment_needed

create TABLE Workout_Exercises
id
workout_id (FK)
exercise_id (FK)
sets
reps

create TABLE User_Workout_Log
log_id
user_id (FK)
workout_id (FK)
date_completed
calories_burned
