package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object Category : Table("category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255).nullable()
    val image = text("image").nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class CategoryDTO(
    val id: Long? = null,
    val name: String?,
    val image: String?
)