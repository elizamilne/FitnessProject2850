package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object Exercise : Table("exercise") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255).nullable()
    val image = text("image").nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ExerciseDTO(
    val id: Long? = null,
    val name: String?,
    val image: String?
)

@kotlinx.serialization.Serializable
data class ExerciseDetailDTO(
    val id: Long,
    val name: String,
    val image: String,
    val categoryIds: List<Long>,
    val muscleGroupIds: List<Long>
)