create TABLE USES
user_id
name
email
password
role (user / trainer / admin)
create TABLE goals
goal_id
user_id (FK)
goal_type
target_weight
deadline
create TABLE progress
progress_id
user_id (FK)
weight
body_fat_percentage
date
create TABLE workouts
workout_id
trainer_id (FK)
title
description
difficulty
create TABLE reviews
review_id
user_id (FK)
trainer_id (FK)
rating
comment