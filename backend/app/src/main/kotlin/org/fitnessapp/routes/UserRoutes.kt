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
import org.fitnessapp.services.toCreateUserRequest
import org.fitnessapp.services.toUserResponse

fun Route.userRoutes() {
    route("/user") {
        post("/register") {
            val request = call.receive<RegisterRequest>()
        
            val existingUser = UserService.findUserByEmail(request.email)
            
            if (existingUser != null) { 
                call.respond(HttpStatusCode.Conflict, "User already exists")
                return@post
            }

            val hashedPassword = BCrypt.hashpw(
                request.password,
                BCrypt.gensalt()
            )

            val createRequest = request.toCreateUserRequest(hashedPassword)

            val userId = UserService.createActivityAndReturnId(createRequest)
            
            val createdUser = UserService.findUserById(userId)
                ?: return@post call.respond(HttpStatusCode.InternalServerError)
            
            call.respond(
                HttpStatusCode.Created,
                createdUser
            )
        }

        post("/login") {
            val request = call.receive<LoginRequest>()

            val existingUser = UserService.findUserByEmail(request.email)

            if (existingUser == null) {
                call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
                return@post
            }

            val storedHash = existingUser[User.hashPass]

            if (!BCrypt.checkpw(request.password, storedHash)) { 
                call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
                return@post
            }

            val user = existingUser.toUserResponse()

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