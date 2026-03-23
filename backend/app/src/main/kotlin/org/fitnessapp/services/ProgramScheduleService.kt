package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.ProgramSchedule
import org.fitnessapp.models.ProgramScheduleDTO

fun ResultRow.toProgramScheduleDTO() = ProgramScheduleDTO(
    id = this[ProgramSchedule.id],
    day = this[ProgramSchedule.day],
    programId = this[ProgramSchedule.programId]
)

object ProgramScheduleService {

    fun findSchedulesByProgramId(programId: Long) = transaction {
        ProgramSchedule.selectAll()
            .where { ProgramSchedule.programId eq programId }
            .map { it.toProgramScheduleDTO() }
    }
}