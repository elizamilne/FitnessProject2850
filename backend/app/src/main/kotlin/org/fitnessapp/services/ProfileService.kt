package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement

import java.math.BigDecimal

import org.fitnessapp.models.Profile
import org.fitnessapp.models.ProfileDTO
import org.fitnessapp.models.CreateProfileRequest

fun ResultRow.toProfileDTO() = ProfileDTO(
    id = this[Profile.id],
    userId = this[Profile.userId],
    goal = this[Profile.goal],
    gender = this[Profile.gender],
    age = this[Profile.age],
    level = this[Profile.level],
    weight = this[Profile.weight].toDouble(),
    height = this[Profile.height].toDouble(),
    workoutFrequency = this[Profile.workoutFrequency]
)

fun CreateProfileRequest.toProfileDTO(id: Long) = ProfileDTO(
    id = id,
    userId = userId,
    goal = goal,
    gender = gender,
    age = age,
    level = level,
    weight = weight,
    height = height,
    workoutFrequency = workoutFrequency
)

object ProfileService {
    fun createProfile(
        builder: InsertStatement<*>,
        profile: CreateProfileRequest
    ) {
        builder[Profile.userId] = profile.userId
        builder[Profile.goal] = profile.goal
        builder[Profile.gender] = profile.gender
        builder[Profile.age] = profile.age
        builder[Profile.level] = profile.level
        builder[Profile.weight] = BigDecimal.valueOf(profile.weight)
        builder[Profile.height] = BigDecimal.valueOf(profile.height)
        builder[Profile.workoutFrequency] = profile.workoutFrequency
    }

    // DTO functions 

    fun getAllProfiles(): List<ProfileDTO> = transaction {
        Profile.selectAll().map { it.toProfileDTO() }
    }

    fun getProfileById(id: Long): ProfileDTO? = transaction {
        Profile.selectAll()
            .where { Profile.id eq id }
            .map { it.toProfileDTO() }
            .singleOrNull()
    }

    fun getProfileByUserId(userId: Long): ProfileDTO? = transaction {
        Profile.selectAll()
            .where { Profile.userId eq userId }
            .map { it.toProfileDTO() }
            .singleOrNull()
    }

    // DB-level functions

    fun findProfileRowById(id: Long): ResultRow? = transaction {
        Profile.selectAll()
            .where { Profile.id eq id }
            .singleOrNull()
    }

    fun createProfileAndReturnId(profile: CreateProfileRequest): Long = transaction {
        Profile.insert { builder ->
            createProfile(builder, profile)
        } get Profile.id
    }

    fun deleteProfileById(id: Long): Int = transaction {
        Profile.deleteWhere { Profile.id eq id }
    }
}