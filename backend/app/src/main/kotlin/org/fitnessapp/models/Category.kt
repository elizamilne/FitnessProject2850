package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object Category : Table("category") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255).nullable()
    val image = text("image").nullable()
    override val primaryKey = PrimaryKey(id)
}