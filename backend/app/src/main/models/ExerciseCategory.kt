object ExerciseCategory : Table("exercise_categories") {
    val exerciseId = reference("exercise_id", Exercise.id)
    val categoryId = reference("category_id", Category.id)

    override val primaryKey = PrimaryKey(exerciseId, categoryId)
}

