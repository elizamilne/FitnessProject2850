package org.fitnessapp.services

import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.ResultRow

import org.fitnessapp.models.User
import org.fitnessapp.models.UserResponse
import org.fitnessapp.models.CreateUserRequest
import org.fitnessapp.models.RegisterRequest

fun RegisterRequest.toCreateUserRequest(hashedPassword: String): CreateUserRequest {
    return CreateUserRequest(
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.email,
        hashPass = hashedPassword
    )
}

fun ResultRow.toUserResponse(): UserResponse {
    return UserResponse(
        id = this[User.id],
        firstName = this[User.firstName],
        lastName = this[User.lastName],
        email = this[User.email],
        createdAt = this[User.createdAt].toString()
    )
}

object UserService {
    fun createUser(
        builder: InsertStatement<*>,
        request: CreateUserRequest,
    ) {
        builder[User.firstName] = request.firstName
        builder[User.lastName] = request.lastName
        builder[User.email] = request.email
        builder[User.hashPass] = request.hashPass
    }

    fun findUserById(id: Long): UserResponse? = transaction {
        User.selectAll()
            .where { User.id eq id }
            .map {
                UserResponse(
                    id = it[User.id],
                    firstName = it[User.firstName],
                    lastName = it[User.lastName],
                    email = it[User.email],
                    createdAt = it[User.createdAt].toString(),
                )
            }
            .singleOrNull()
    }

    fun findUserByEmail(email: String) = transaction {
        User.selectAll()
            .where { User.email eq email }
            .singleOrNull()
    }

    fun createActivityAndReturnId(request: CreateUserRequest) = transaction { 
        User.insert { builder ->
            createUser(builder, request)
        } get User.id
    }
}
