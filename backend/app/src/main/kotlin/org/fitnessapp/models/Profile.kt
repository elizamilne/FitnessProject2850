package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object Profile : Table("profile") {
    val id = long("id").autoIncrement()
    val userId = reference("user_id", User.id).uniqueIndex()
    val goal = varchar("goal", 255).nullable()
    val gender = varchar("gender", 255).nullable()
    val age = integer("age").nullable()
    val level = varchar("level", 255).nullable()
    val weight = decimal("weight", 5, 2).nullable()
    val height = decimal("height", 5, 2).nullable()
    val workoutFrequency = integer("workout_frequency").nullable()
    override val primaryKey = PrimaryKey(id)
}