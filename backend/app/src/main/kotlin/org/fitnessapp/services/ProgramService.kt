package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.InsertStatement

import java.time.LocalDate
import java.time.format.TextStyle
import java.util.Locale

import org.fitnessapp.models.Program
import org.fitnessapp.models.ProgramDTO
import org.fitnessapp.models.CreateProgramRequest
import org.fitnessapp.models.ProgramSchedule

fun ResultRow.toProgramDTO(days: List<String>) = ProgramDTO(
    id = this[Program.id],
    profileId = this[Program.profileId],
    title = this[Program.title],
    bannerUrl = this[Program.bannerUrl],
    weeklyFrequency = days
)

object ProgramService { 
    fun createProgram(
        builder: InsertStatement<*>,
        request: CreateProgramRequest
    ) {
        builder[Program.title] = request.title
        builder[Program.bannerUrl] = request.bannerUrl
        builder[Program.profileId] = request.profileId
    }

    fun findProgramsByProfileId(profileId: Long): List<ProgramDTO> = transaction {
        Program.selectAll()
            .where { Program.profileId eq profileId }
            .map { row ->
                val programId = row[Program.id]

                val days = ProgramSchedule.selectAll()
                    .where { ProgramSchedule.programId eq programId }
                    .map { it[ProgramSchedule.day] }

                row.toProgramDTO(days)
            }
    }

    fun findProgramsByProfileIdAndDay(
        profileId: Long, 
        day: String
    ): List<ProgramDTO> = transaction {
        
        Program.selectAll()
            .where { Program.profileId eq profileId }
            .mapNotNull { row ->
                val programId = row[Program.id]

                val days = ProgramSchedule.selectAll()
                    .where { ProgramSchedule.programId eq programId }
                    .map { it[ProgramSchedule.day] }

                if (day in days) {
                    row.toProgramDTO(days)
                } else {
                    null
                }
            }
    }

    fun getDayOfWeek(dateParam: String?): String? {
        return dateParam?.let {
            val date = LocalDate.parse(it) 
            date.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.ENGLISH)
        }
    }

    fun findProgramById(programId: Long): ResultRow? = transaction {
        Program
            .selectAll().where { Program.id eq programId }
            .singleOrNull()
    }

}