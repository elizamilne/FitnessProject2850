package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.date

object Race : Table("race") {
    val id = long("id").autoIncrement()
    val profileId = reference("profile_id", Profile.id)
    val title = varchar("title", 255)
    val location = varchar("location", 255)
    val date = date("date")
    val bannerUrl = text("banner_url").nullable()
    override val primaryKey = PrimaryKey(id)
}