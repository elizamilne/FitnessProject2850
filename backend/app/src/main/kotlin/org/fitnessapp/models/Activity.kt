package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.*

object Activity : Table("activity") {

    val id = long("id").autoIncrement()

    val date = date("date")
    
    val profileId = reference("profile_id", Profile.id)
    val exerciseId = reference("exercise_id", Exercise.id)

    override val primaryKey = PrimaryKey(id)
}