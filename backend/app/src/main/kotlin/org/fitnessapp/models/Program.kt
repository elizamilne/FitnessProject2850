package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object Program : Table("program") {
    val id = long("id").autoIncrement()
    val profileId = reference("profile_id", Profile.id)
    val title = varchar("title", 255)
    val bannerUrl = text("banner_url").nullable()
    override val primaryKey = PrimaryKey(id)
}