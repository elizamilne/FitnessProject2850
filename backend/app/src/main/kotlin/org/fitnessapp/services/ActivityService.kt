package org.fitnessapp.services

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.fitnessapp.models.*
import java.time.LocalDate
import org.jetbrains.exposed.sql.statements.InsertStatement

fun ResultRow.toActivityDTO() = ActivityDTO(
    id = this[Activity.id],
    date = this[Activity.date].toString(),
    profileId = this[Activity.profileId],
    exerciseId = this[Activity.exerciseId]
)

fun CreateActivityRequest.toActivityDTO(id: Long) = ActivityDTO(
    id = id,
    date = date,
    profileId = profileId,
    exerciseId = exerciseId
)

object ActivityService {
    fun createActivity(
        builder: InsertStatement<*>,
        request: CreateActivityRequest
    ) {
        builder[Activity.date] = LocalDate.parse(request.date)
        builder[Activity.profileId] = request.profileId
        builder[Activity.exerciseId] = request.exerciseId
    }

    fun findActivitiesByProfile(
        profileId: Long,
        date: java.time.LocalDate?
    ): List<ActivityDTO> = transaction {
        Activity.selectAll().where {
            if (date != null) {
                (Activity.profileId eq profileId) and (Activity.date eq date)
            } else {
                Activity.profileId eq profileId
            }
        }.map {
            it.toActivityDTO()
        }
    }
}


