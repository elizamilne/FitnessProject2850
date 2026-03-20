package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object User : Table("user") {
    val id = long("id").autoIncrement()
    val email = varchar("email", 255).uniqueIndex()
    val firstName = varchar("first_name", 255).nullable()
    val lastName = varchar("last_name", 255).nullable()
    val hashPass = varchar("hash_pass", 255)
    override val primaryKey = PrimaryKey(id)
}