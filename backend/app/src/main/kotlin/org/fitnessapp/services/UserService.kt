package org.fitnessapp.services

import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.User
import org.fitnessapp.models.UserResponse

object UserService {
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
}
