package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.insert

import org.fitnessapp.models.ProgramSchedule
import org.fitnessapp.models.ProgramScheduleDTO
import org.fitnessapp.models.CreateProgramScheduleRequest

fun ResultRow.toProgramScheduleDTO() = ProgramScheduleDTO(
    id = this[ProgramSchedule.id],
    day = this[ProgramSchedule.day],
    programId = this[ProgramSchedule.programId]
)

object ProgramScheduleService {
    fun createProgramSchedule(
        builder: InsertStatement<*>,
        request: CreateProgramScheduleRequest
    ) {
        builder[ProgramSchedule.day] = request.day
        builder[ProgramSchedule.programId] = request.programId
    }

    fun findSchedulesByProgramId(programId: Long) = transaction {
        ProgramSchedule.selectAll()
            .where { ProgramSchedule.programId eq programId }
            .map { it.toProgramScheduleDTO() }
    }

    fun findScheduleById(id: Long) = transaction {
        ProgramSchedule.selectAll()
            .where { ProgramSchedule.id eq id }
            .map { it.toProgramScheduleDTO() }
            .singleOrNull()
    }

    fun createProgramScheduleAndReturnId(request: CreateProgramScheduleRequest): Long = transaction {
        ProgramSchedule.insert { builder ->
            createProgramSchedule(builder, request)
        } get ProgramSchedule.id
    }

    fun deleteProgramScheduleById(id: Long): Int = transaction {
        ProgramSchedule.deleteWhere { ProgramSchedule.id eq id }
    }

    fun deleteProgramSchedules(programId: Long) {
        ProgramSchedule.deleteWhere { ProgramSchedule.programId eq programId }
    }
}