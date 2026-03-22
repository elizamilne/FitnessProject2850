package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object Program : Table("program") {
    val id = long("id").autoIncrement()
    val profileId = reference("profile_id", Profile.id)
    val title = varchar("title", 255)
    val bannerUrl = text("banner_url").nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ProgramDTO(
    val id: Long? = null,
    val profileId: Long,
    val title: String,
    val bannerUrl: String? = null,
    val weeklyFrequency: List<String>
)

@Serializable
data class CreateProgramRequest(
    val title: String,
    val bannerUrl: String,
    val profileId: Long
)