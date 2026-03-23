package org.fitnessapp.routes

import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.application.*
import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

import org.fitnessapp.services.UserService

fun Route.userRoutes() {
    route("/user") {
        post("/register") {
            val request = call.receive<RegisterRequest>()
            
            val existingUser = transaction {
                User.selectAll().where {
                    (User.email eq request.email)
                }.singleOrNull()
            }

            if (existingUser != null) { 
                call.respond(HttpStatusCode.Conflict, "User already exists")
                return@post
            }

            val hashedPassword = BCrypt.hashpw(
                request.password,
                BCrypt.gensalt()
            )

            val userId = transaction { 
                User.insert {
                    it[firstName] = request.firstName
                    it[lastName] = request.lastName
                    it[email] = request.email
                    it[hashPass] = hashedPassword
                } get User.id
            }

            val createdUser = UserService.findUserById(userId)
                ?: return@post call.respond(HttpStatusCode.InternalServerError)
            
            call.respond(
                HttpStatusCode.Created,
                createdUser
            )
        }

        post("/login") {
            val request = call.receive<LoginRequest>()

            val userRow = transaction {
                User.selectAll()
                    .where{ User.email eq request.email }
                    .singleOrNull()
            }

            if (userRow == null) {
                call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
                return@post
            }

            val storedHash = userRow[User.hashPass]

            if (!BCrypt.checkpw(request.password, storedHash)) { 
                call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
                return@post
            }

            val user = UserResponse(
                id = userRow[User.id],
                firstName = userRow[User.firstName],
                lastName = userRow[User.lastName],
                email = userRow[User.email],
                createdAt = userRow[User.createdAt].toString()
            )

            call.respond(
                HttpStatusCode.OK,
                user
            )
        }

        post("/logout") {
            call.respond(HttpStatusCode.OK, mapOf("message" to "Logged out successfully"))
        }
    }
}