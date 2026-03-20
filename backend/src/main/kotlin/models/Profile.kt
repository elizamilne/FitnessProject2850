package org.example.models
import org.jetbrains.exposed.sql.Table
object Profile : Table("profile") {
    val id = long("id").autoIncrement()
    val userId = reference("user_id", Users.id).uniqueIndex()
    val goal = varchar("goal", 255).nullable()
    val gender = varchar("gender", 255).nullable()
    val age = integer("age").nullable()
    val level = varchar("level", 255).nullable()
    val weight = decimal("weight", 5, 2).nullable()
    val height = decimal("height", 5, 2).nullable()
    val workoutFrequency = integer("workout_frequency").nullable()
    override val primaryKey = PrimaryKey(id)
}