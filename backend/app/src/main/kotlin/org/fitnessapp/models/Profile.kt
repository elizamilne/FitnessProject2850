package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object Profile : Table("profile") {
    val id = long("id").autoIncrement()
    val userId = reference("user_id", User.id).uniqueIndex()
    val goal = varchar("goal", 255).nullable()
    val gender = varchar("gender", 255).nullable()
    val age = integer("age").nullable()
    val level = varchar("level", 255).nullable()
    val weight = decimal("weight", 5, 2)
    val height = decimal("height", 5, 2)
    val workoutFrequency = integer("workout_frequency").nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable 
data class ProfileDTO(
    val id: Long? = null,
    val userId: Long,
    val goal: String?,                
    val gender: String?,            
    val age: Int?,                 
    val level: String?,              
    val weight: Double,            
    val height: Double,             
    val workoutFrequency: Int?      
)

@Serializable
data class CreateProfileRequest(
    val userId: Long,
    val goal: String?,
    val gender: String?,
    val age: Int?,
    val level: String?,
    val weight: Double,
    val height: Double,
    val workoutFrequency: Int?
)