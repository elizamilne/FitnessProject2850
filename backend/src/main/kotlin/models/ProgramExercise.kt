package org.example.models
import org.jetbrains.exposed.sql.Table
object ProgramExercise : Table("program_exercise") {
    val id = long("id").autoIncrement()
    val programId = reference("program_id", Program.id)
    val exerciseId = reference("exercise_id", Exercise.id)
    override val primaryKey = PrimaryKey(id)
}