package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.javatime.*

object Activity : Table("activity") {
    
    val id = long("id").autoIncrement()

    val date = date("date")
    
    val profileId = reference("profile_id", Profile.id)
    val exerciseId = reference("exercise_id", Exercise.id)

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ActivityDTO(
    val id: Long? = null,
    val date: String,
    val profileId: Long,
    val exerciseId: Long
)

@Serializable
data class CreateActivityRequest(
    val date: String,
    val profileId: Long,
    val exerciseId: Long
)
