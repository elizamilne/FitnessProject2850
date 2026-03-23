package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.timestamp
import kotlinx.serialization.Serializable
import java.time.Instant

object User : Table("user") {
    val id = long("id").autoIncrement()
    val email = varchar("email", 255).uniqueIndex()
    val firstName = varchar("first_name", 255)
    val lastName = varchar("last_name", 255)
    val hashPass = varchar("hash_pass", 255)
    
    val createdAt = timestamp("created_at").clientDefault{ Instant.now() }

    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String,
)

@Serializable
data class UserResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val createdAt: String
)

@Serializable
data class CreateUserRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val hashPass: String
)
