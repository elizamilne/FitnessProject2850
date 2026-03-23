package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.date
import kotlinx.serialization.Serializable

object Race : Table("race") {
    val id = long("id").autoIncrement()
    val profileId = reference("profile_id", Profile.id)
    val title = varchar("title", 255)
    val location = varchar("location", 255)
    val date = date("date")
    val bannerUrl = text("banner_url").nullable()
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class RaceDTO(
    val id: Long? = null,
    val profileId: Long,
    val title: String,
    val location: String,
    val date: String,
    val bannerUrl: String? = null
)

@Serializable
data class UpdateRaceRequest(
    val title: String,
    val location: String,
    val date: String,
    val bannerUrl: String? = null
)

@Serializable
data class CreateRaceRequest(
    val profileId: Long,
    val title: String,
    val location: String,
    val date: String, 
    val bannerUrl: String? = null
)
